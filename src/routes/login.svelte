<svelte:head>
	<title>Login</title>
</svelte:head>

<script>
    import { stores } from "@sapper/app";
    import { onDestroy } from 'svelte';
    import { Form, FormGroup, Input, Label } from 'sveltestrap/src';
    import { isEmpty } from '../components/inputValidation'
    import { Button } from 'sveltestrap/src';

    let apiUrl = '';
  	const { session } = stores();
    const unsubscribe = session.subscribe(value => {
    	apiUrl = value.API_URL;
  	});
  	onDestroy(unsubscribe);

    let email = '';
    let password = '';
    let formValidator = '';

    let access_token;
    
    async function loginUser () {
        if (isEmpty(email) || isEmpty(password)) {
			formValidator = "Email and password cannot be empty!";
		}
        else {
            var formdata = new FormData();
            formdata.append("username", email);
            formdata.append("password", password);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            await fetch(`${apiUrl}/token`, requestOptions)
                .then(r => r.json())
                .then(r => {
                    if (r.access_token) {
                        access_token = r.access_token;
                        formValidator = "";
                    }
                    else {
                        formValidator = r.detail;
                    }
                });
        }
    }
</script>

<style>
    #display {
        width: 80%;
        padding-top: 20px;
        color: red;
        position: relative;
    }
</style>

<div>
    <Form>
        <FormGroup>
            <Label for="email">Email</Label>
            <Input plaintext id="email" bind:value={email} placeholder="Your email" />
        </FormGroup>
        <FormGroup>
            <Label for="password">Password</Label>
            <Input plaintext id="password" bind:value={password} placeholder="Your password" />
        </FormGroup>
    </Form>
    <Button color="primary" on:click={loginUser}>Login</Button>
</div>

<div id="display">
    {#if formValidator}
        <p>{formValidator}</p>
    {:else if access_token}
        <p>{access_token}</p>
    {/if}
</div>
