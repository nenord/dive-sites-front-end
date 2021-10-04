<script>
	import { onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { mapbox, key } from './mapbox.js';
	import { createEventDispatcher } from 'svelte';
	import { Spinner } from 'sveltestrap/src';

	const dispatch = createEventDispatcher();

	setContext(key, {
		getMap: () => map
	});

	export let lat;
	export let lon;
	export let zoom;
	export let select;
	let container;
	let map;

	onMount(() => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://unpkg.com/mapbox-gl/dist/mapbox-gl.css';

		link.onload = () => {
			map = new mapbox.Map({
				container,
				style: 'mapbox://styles/mapbox/outdoors-v11',
				center: [lon, lat],
				zoom
			});
			if (select) {
				map.on('click', function(e) {
					dispatch('message', {
						newLat: parseFloat(e.lngLat.lat.toFixed(5)),
						newLon: parseFloat(e.lngLat.lng.toFixed(5))
					});
				});
			} 
		};

		document.head.appendChild(link);

		return () => {
			if (map) {
				map.remove();
				link.parentNode.removeChild(link);
			}
		};
	});

</script>

<style>
	div {
		width: 100%;
		height: 100%;
	}
	#loading {
		position: relative;
		left: 45%;
		top: 100px;
	}
</style>

<div bind:this={container}>
	{#if map}
		<slot></slot>
	{:else}
		<div id="loading" transition:fade="{{duration: 300}}"><Spinner color="dark" /></div>
	{/if}
</div>