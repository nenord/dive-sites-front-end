<script context="module">
	export async function preload({ params }) {
		const res = await this.fetch(`http://localhost:8000/sites/${params.slug}`);
		const data = await res.json();

		if (res.status === 200) {
			return { site: data };
		} else {
			this.error(res.status, data.detail);
		}
	}
</script>

<script>
	export let site;
	import Map from '../../components/Map.svelte';
	import MapMarker from '../../components/MapMarker.svelte';
</script>

<style>
	.content :global(h2) {
		font-size: 1.4em;
		font-weight: 500;
	}

	.content :global(pre) {
		background-color: #f9f9f9;
		box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
		padding: 0.5em;
		border-radius: 2px;
		overflow-x: auto;
	}

	.content :global(pre) :global(code) {
		background-color: transparent;
		padding: 0;
	}

	.content :global(ul) {
		line-height: 1.5;
	}

	.content :global(li) {
		margin: 0 0 0.5em 0;
	}

	.container {
		display: flex;
	}

	#mapping {
		width: 80%;
		height: 500px;
		margin-left:10px;
	}
</style>

<svelte:head>
	<title>{site.name}</title>
</svelte:head>

<h2>{site.name}</h2>
<div class="container">
	<div class="content">
		<p>Latitude: {site.lat}</p>
		<p>Longitude: {site.lon}</p>
		<h4>Description</h4>
		<p>{site.description}</p>
	</div>
	<div id="mapping">
		<Map lat={site.lat} lon={site.lon} zoom={12} select={false}}>
			<MapMarker lat={site.lat} lon={site.lon} name={site.name} slug={site.slug}/>
		</Map>
	</div>
</div>

