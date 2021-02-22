<script context="module">
	export async function preload({ params }) {
		const res = await this.fetch(`http://freedive-api.nenoapps.tk/sites/${params.slug}`);
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
	.container {
		display: flex;
		flex-flow: row wrap;
	}

	.content {
		flex: 1 0 300px;
		margin-right: 10px;
	}

	.map {
		flex: 1 0 300px;
		height: 400px;
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
	<div class="map">
		<Map lat={site.lat} lon={site.lon} zoom={12} select={false}}>
			<MapMarker lat={site.lat} lon={site.lon} name={site.name} slug={site.slug}/>
		</Map>
	</div>
</div>

