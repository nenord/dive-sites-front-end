<svelte:head>
	<title>Add sites</title>
</svelte:head>

<script>
	import { goto, stores } from "@sapper/app";
	import { onDestroy } from 'svelte';
	import Map from '../components/Map.svelte';
	import { strLen, invalidCoord, invalidDepth, lenForPark } from '../components/inputValidation'
	import { Form, FormGroup, Input, Label } from 'sveltestrap/src';
	import { Button, Modal,	ModalBody, ModalFooter,	ModalHeader } from 'sveltestrap/src';

	let apiUrl = '';
  	const { session } = stores();
    const unsubscribe = session.subscribe(value => {
    	apiUrl = value.API_URL;
  	});
  	onDestroy(unsubscribe);
	
	let select = true;
	let newLat;
	let newLon;
	let newSlug;
	let siteName = '';
	let siteDesc = '';
	let siteDepth;
	let sitePark = '';
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
		sitePark = '';
		siteDepth = 0;
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
		else if (invalidDepth(siteDepth)) {
			formValidator = "Depth must be between 1 and 200 m!";
		}
		else if (strLen(siteDesc, 10, 200)) {
			formValidator = "Site description needs to have 10-200 characters!";
		}
		else if (lenForPark(sitePark, 10, 200)) {
			formValidator = "Park and approach must have 10-200 characters OR be empty!";
		}
		else {
			let payload = { 
				name: siteName,
				lat: newLat,
				lon: newLon,
				description: siteDesc,
				depth: siteDepth
			}
			if (sitePark.trim().length >= 10) {
				payload.park_approach = sitePark;
			}
			var requestOptions = {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { "Content-Type": "application/json" }
			};

		fetch(`${apiUrl}/sites/create`, requestOptions)
			.then((r) => {
				if (r.status == 201 || r.status == 409) {
					return r.json();
				} 
				else {
					return r.text();
				}
			})
			.then(result => {
				if (result._id) {
					newSlug = result._id;
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

<p class="hide">To add a dive site, click on the site's location!</p>

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
					<Label for="siteName">Site name*</Label>
					<Input plaintext id="siteName" bind:value={siteName} placeholder="Add site name" />
				</FormGroup>
				<FormGroup>
					<Label for="latitude">Latitude*</Label>
					<Input type="number" name="number" id="latitude" bind:value={newLat} />
				</FormGroup>
				<FormGroup>
					<Label for="longitude">Longitude*</Label>
					<Input type="number" id="longitude" bind:value={newLon} />
				</FormGroup>
				<FormGroup>
					<Label for="depth">Depth*</Label>
					<Input type="number" id="depth" bind:value={siteDepth} />
				</FormGroup>
				<FormGroup>
					<Label for="description">Description*</Label>
					<Input type="textarea" id="description" bind:value={siteDesc} 
						placeholder="Area, risks, visibility, sealife ... " />
				</FormGroup>
				<FormGroup>
					<Label for="park">Park and approach</Label>
					<Input type="textarea" id="park" bind:value={sitePark} 
						placeholder="Optional, where to park and how to approach the site" />
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