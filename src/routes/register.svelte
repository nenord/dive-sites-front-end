<svelte:head>
	<title></title>
</svelte:head>

<script>
    import { goto, stores } from "@sapper/app";
    import { onMount, onDestroy } from 'svelte';
    import { Form, FormGroup, Input, Label } from 'sveltestrap/src';
    import { passwodComplexity, strLen } from '../components/inputValidation'
    import { Button, Modal,	ModalBody, ModalFooter,	ModalHeader } from 'sveltestrap/src';

    let apiUrl = '';
   
    const { session } = stores();

    const unsubscribe = session.subscribe(value => {
    	apiUrl = value.API_URL;
  	});
  	onDestroy(unsubscribe);

    let email = '';
    let userName = '';
    let password = '';
    let passwordCheck = '';
    let formValidator = '';
    let open = false;

	onMount(() => {
		if ($session.access_token) {
			goto('/');
		}
  	});

    function cancelModal () {
		goto('/login');
	}
    
    async function registerUser () {
        if (strLen(userName, 3, 32)) {
			formValidator = "Username must be 3 to 32 characters long!";
		}
        else if (strLen(password, 8, 16)) {
            formValidator = "Password must be 8 to 16 characters long!";
        }
        else if(passwodComplexity(password)) {
            formValidator = "Password must have at least one uppercase and one lowercase letter, one number and one special character!"
        }
        else if (password != passwordCheck) {
            formValidator = "Passwords must match!";
        }
        else {
            var requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ user_name: userName, email, password }),
            };

            await fetch(`${apiUrl}/users/create`, requestOptions)
                .then((r) => {
                    if (r.status == 201 || r.status == 409) {
                        return r.json();
                    }
                    else {
                        return r.text();
                    }
                })
                .then(result => {
                    if (result._id) {
                        console.log(result);
                        formValidator = '';
                        open = true;
                    }
                    else if (result.detail) {
                        formValidator = result.detail;
                    }
                    else {
                        let info = JSON.parse(result);
                        const errorStr = `${info.detail[0].loc[1]}: ${info.detail[0].msg}!`;
                        formValidator = errorStr.charAt(0).toUpperCase() + errorStr.slice(1);
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

{#if !open}
    <div>
        <Form>
            <FormGroup>
                <Label for="userName">Username*</Label>
                <Input plaintext id="userName" bind:value={userName} placeholder="Your display name" />
            </FormGroup>
            <FormGroup>
                <Label for="email">Email*</Label>
                <Input type="email" id="email" bind:value={email} placeholder="Your email" />
            </FormGroup>
            <FormGroup>
                <Label for="password">Password*</Label>
                <Input type="password" id="password" bind:value={password} placeholder="Your password" />
            </FormGroup>
            <FormGroup>
                <Label for="passwordCheck">Retype password*</Label>
                <Input type="password" id="passwordCheck" bind:value={passwordCheck} placeholder="Type password again" />
            </FormGroup>
        </Form>
        <Button color="primary" on:click={registerUser}>Register</Button>
    </div>
{/if}

<div id="display">
    {#if formValidator}
        <p>{formValidator}</p>
    {/if}
</div>

<div>
	<Modal isOpen={open} toggle={cancelModal}>
	<ModalHeader toggle={cancelModal}>New user</ModalHeader>
	<ModalBody>
        <h6>User '{userName}' added!</h6>
	</ModalBody>
	<ModalFooter>
		<Button color="primary" on:click={cancelModal}>Close</Button>
	</ModalFooter>
	</Modal>
</div>