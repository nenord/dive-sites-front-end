<script>
	import { getContext } from 'svelte';
	import { mapbox, key } from './mapbox.js';

	const { getMap } = getContext(key);
	const map = getMap();

	export let lat;
	export let lon;
	export let name;
	export let slug;

	const popup = new mapbox.Popup({ offset: 25, closeButton: false })
		.setHTML(`<a href="/sites/${slug}">${name}</a>`);

	const marker = new mapbox.Marker()
		.setLngLat([lon, lat])
		.setPopup(popup)
		.addTo(map);
</script>