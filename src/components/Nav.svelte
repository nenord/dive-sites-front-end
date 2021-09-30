<script>
	import { goto, stores } from "@sapper/app";
	import { onDestroy } from 'svelte';
	export let segment;

	let tokenExists = '';
	let userExists = '';
	let message = '';

	const { session } = stores();
    const unsubscribe = session.subscribe(value => {
    	tokenExists = value.access_token;
		userExists = value.user_name;
  	});
  	onDestroy(unsubscribe);

	async function logoutUser () {
		var requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({send: 'User logging out'}),
            };
		await fetch('/logout', requestOptions)
			.then(r => r.json())
			.then(r => {message = r.detail});
			tokenExists = '';
			console.log(message);
			$session.access_token = null;
			$session.user_name = null;
			goto('/login');
	}
</script>

<style>
	nav {
		position: relative;
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	ul {
		margin: 0;
		padding: 0;
		align-items: baseline;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	h6 {
		padding-top: 1em;
		padding-bottom: 0.5em;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
	<ul>
		<li><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">Home</a></li>
		<li><a aria-current="{segment === 'add-site' ? 'page' : undefined}" href="add-site">Add sites</a></li>

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
		<li><a rel=prefetch aria-current="{segment === 'sites' ? 'page' : undefined}" href="sites">Sites</a></li>
		{#if !tokenExists}
        	<li><a rel=prefetch aria-current="{segment === 'login' ? 'page' : undefined}" href="login">Login</a></li>
    	{:else}
			<li><a  href="login" on:click={logoutUser}>Logout</a></li>
    	{/if}		
	</ul>
	{#if userExists}
		<h6>Hello {userExists}!</h6>
	{/if}
</nav>
