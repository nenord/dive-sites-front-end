<script context="module">
	export function preload() {
		return this.fetch(`http://35.241.204.178/sites`).then(r => r.json()).then(sites => {
			return { sites };
		});
	}
</script>

<script>
	import Map from '../components/Map.svelte';
	import MapMarker from '../components/MapMarker.svelte';
	
	export let sites;
	let select = false;
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

<svelte:head>
	<title>Daibh - dive sites map</title>
</svelte:head>

<h2>Find dive sites</h2>

<div id="mapping">
	<Map lat={55.95} lon={-3.18} zoom={10} {select}>
		{#each sites as site}
			<MapMarker lat={site.lat} lon={site.lon} name={site.name} slug={site.slug}/>
		{/each}
	</Map>
</div>


