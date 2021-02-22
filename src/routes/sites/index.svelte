<script context="module">
	export function preload() {
		return this.fetch(`http://freedive-api.nenoapps.tk/sites`).then(r => r.json()).then(sites => {
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
	<title>Sites</title>
</svelte:head>

<h2>Sites</h2>

<ul>
	{#each sites as site}
		<!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to heroku ad the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event -->
		<li><a rel="prefetch" href="sites/{site.slug}">{site.name}</a></li>
	{/each}
</ul>
