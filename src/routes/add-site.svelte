<svelte:head>
	<title>Add dive site</title>
</svelte:head>

<script>
	import { goto } from "@sapper/app";
	import Map from '../components/Map.svelte';
	import { strLen, invalidCoord } from '../components/inputValidation'
	import { Form, FormGroup, Input, Label } from 'sveltestrap/src';
	import { Button, Modal,	ModalBody, ModalFooter,	ModalHeader } from 'sveltestrap/src';

	let select = true;
	let newLat;
	let newLon;
	let newSlug;
	let siteName = '';
	let siteDesc = '';
	let open = false;
	let itIsAdded = false;
	let formValidator = '';
	let serverErr = '';

	function handleMessage(event) {
		newLat = event.detail.newLat;
		newLon = event.detail.newLon;
		open = true;
	}

	function cancelModal () {
		open = false;
		itIsAdded = false;
		siteName = '';
		siteDesc = '';
		formValidator = '';
		serverErr = '';
		if (newSlug) {
			goto(`/sites/${newSlug}`)
		}
	}

	function addNewSite () {
		if (strLen(siteName, 3, 30)) {
			formValidator = "Site name needs to have 3-30 characters!";
		}
		else if (invalidCoord(newLat, 90)) {
			formValidator = "Invalid Latitude!"
		}
		else if (invalidCoord(newLon, 180)) {
			formValidator = "Invalid Longitude!"
		}
		else if (strLen(siteDesc, 10, 200)) {
			formValidator = "Site description needs to have 10-200 characters!";
		}
		else {
			var requestOptions = {
				method: 'POST',
				body: JSON.stringify({ 
					name: siteName,
					lat: newLat,
					lon: newLon,
					description: siteDesc
				}),
				headers: { "Content-Type": "application/json" }
			};

		fetch("http://35.241.204.178/create_site", requestOptions)
			.then((r) => {
				if (r.status == 201 || r.status == 409) {
					return r.json();
				} 
				else {
					return r.text();
				}
			})
			.then(result => {
				if (result.slug) {
					newSlug = result.slug;
					console.log(result);
				}
				else if (result.detail) {
					serverErr = result.detail;
				}
				else {
					let info = JSON.parse(result);
					serverErr = `Error (${info.detail[0].loc[1]}): ${info.detail[0].msg}`;
				}
			});
		
		formValidator = '';
		itIsAdded = true;
		}
	}

</script>

<style>
	#mapping {
		width: 80%;
		height: 500px;
	}

	@media screen and (max-width: 800px){
		#mapping {
			width: 100%;
			height: 500px;
		}
	}
</style>

<h2>Add a dive site</h2>

<p class="hide">To add a dive site, click on the site location on the map below!</p>

<div id="mapping">
	<Map lat={55.95} lon={-3.18} zoom={10} {select} on:message={handleMessage}></Map>
</div>

<div>
	<Modal isOpen={open} toggle={cancelModal}>
	  <ModalHeader toggle={cancelModal}>Add a new site</ModalHeader>
	  <ModalBody>
		{#if !itIsAdded}
			<Form>
				<FormGroup>
					<Label for="siteName">Site name</Label>
					<Input plaintext id="siteName" bind:value={siteName} placeholder="Add site name" />
				</FormGroup>
				<FormGroup>
					<Label for="latitude">Latitude</Label>
					<Input type="number" name="number" id="latitude" bind:value={newLat} />
				</FormGroup>
				<FormGroup>
					<Label for="longitude">Longitude</Label>
					<Input type="number" id="longitude" bind:value={newLon} />
				</FormGroup>
				<FormGroup>
					<Label for="description">Description</Label>
					<Input type="textarea" id="description" bind:value={siteDesc} 
						placeholder="Access, depth, risks ..." />
				  </FormGroup>

			</Form>	
		{:else}
			{#if serverErr}
				<h6>{serverErr}</h6>
			{:else if !newSlug}
				<p>Hmm, something is wrong with the server ...</p>
			{:else}
				<h6>Site '{siteName}' added!</h6>
			{/if}
		{/if}
		<p style="color: rgb(167, 23, 23)">{formValidator}</p>
	  </ModalBody>
	  <ModalFooter>
		<Button color="primary" on:click={addNewSite} disabled={itIsAdded}>Add a site</Button>
		<Button color="secondary" on:click={cancelModal}>
			{itIsAdded ? "Close" : "Cancel"}
		</Button>
	  </ModalFooter>
	</Modal>
</div>