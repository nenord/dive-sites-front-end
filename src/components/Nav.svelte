<script>
	import { goto, stores } from "@sapper/app";
	import { onDestroy } from 'svelte';
	import {
		Collapse,
		Navbar,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink
  	} from 'sveltestrap/src';

	let isOpen = false;
	function toggleClose () {
		isOpen = false;
	}

	let tokenExists = '';
	let message = '';

	const { session } = stores();
    const unsubscribe = session.subscribe(value => {
    	tokenExists = value.access_token;
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
			isOpen = false;
			goto('/login');
	}
</script>

<Navbar color="primary" light expand="md">
	<NavbarBrand href="/" on:click={toggleClose}>apneamap</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse {isOpen} navbar expand="md">
	  <Nav class="ms-auto" navbar>
		<NavItem>
		  <NavLink href="/add-site" on:click={toggleClose}>Add sites</NavLink>
		</NavItem>
		<NavItem>
		  <NavLink href="/sites" on:click={toggleClose}>Sites</NavLink>
		</NavItem>
		{#if !tokenExists}
			<NavItem>
				<NavLink href="/login" on:click={toggleClose}>Login</NavLink>
			</NavItem>
		{:else}
			<NavItem>
				<NavLink on:click={logoutUser} >Logout</NavLink>
			</NavItem>
		{/if}
	  </Nav>
	</Collapse>
  </Navbar>