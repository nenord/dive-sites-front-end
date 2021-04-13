<script context="module">
	export function preload(page, session) {
		const { API_URL } = session;
		return this.fetch(`${API_URL}/sites`).then(r => r.json()).then(sites => {
			return { sites };
		});
	}
</script>

<script>
	export let sites;
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
	}
</style>

<svelte:head>
	<title>Dive sites list</title>
</svelte:head>

<h2>Sites</h2>

<ul>
	{#each sites as site}
		<li><a rel="prefetch" href="sites/{site._id}">{site.name}</a></li>
	{/each}
</ul>
