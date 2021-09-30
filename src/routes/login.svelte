<svelte:head>
	<title>Login</title>
</svelte:head>

<script context="module">
  export function preload(page, session) {
    console.log(session);
  }
</script>

<script>
    import { goto, stores } from "@sapper/app";
    import { Form, FormGroup, Input, Label } from 'sveltestrap/src';
    import { isEmpty } from '../components/inputValidation'
    import { Button } from 'sveltestrap/src';

    let email = '';
    let password = '';
    let formValidator = '';

    const { session } = stores();
    
    async function loginUser () {
        if (isEmpty(email) || isEmpty(password)) {
			formValidator = "Email and password cannot be empty!";
		}
        else {
            var requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, password }),
            };

            await fetch('/login', requestOptions)
                .then(r => r.json())
                .then(r => {
                    if (r.access_token) {
                        $session.access_token = r.access_token;
                        $session.user_name = r.user_name;
                        goto('/');
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
            <Input type="email" id="email" bind:value={email} placeholder="Your email" />
        </FormGroup>
        <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" id="password" bind:value={password} placeholder="Your password" />
        </FormGroup>
    </Form>
    <Button color="primary" on:click={loginUser}>Login</Button>
</div>

<div id="display">
    {#if formValidator}
        <p>{formValidator}</p>
    {/if}
</div>
