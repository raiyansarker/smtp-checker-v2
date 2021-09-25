<script lang="ts">
  import { Provider, StatusEnum } from "../types";
  import Alert from "./Alert.svelte";

  // Inputs
  let server: string;
  let port: number;
  let username: any;
  let password: any;
  let from: any;
  let to: any;

  let submitable: boolean = true;
  let message: string;
  let status: StatusEnum;
  let showAlert = false;
  let submitting = false;

  $: submitting
    ? document.body.classList.add("cursor-wait")
    : document.body.classList.remove("cursor-wait");

  function clearForm() {
    server = null;
    port = null;
    username = null;
    password = null;
    from = null;
    to = null;
  }

  const changeServer = (provider: Provider): void => {
    switch (provider) {
      case Provider.SENDGRID:
        server = "smtp.sendgrid.net";
        !port && (port = 587);
        username = "apikey";
        break;
      case Provider.SPARKPOST:
        server = "smtp.sparkpostmail.com";
        !port && (port = 587);
        username = "SMTP_Injection";
        break;
      case Provider.GMAIL:
        server = "smtp.gmail.com";
        !port && (port = 587);
        break;
      case Provider.MAILGUN:
        server = "smtp.mailgun.org";
        !port && (port = 587);
        break;
    }
  };

  function handleSubmit() {
    submitting = true;
    fetch("/api/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ server, port, username, password, from, to }),
    })
      .then((res) => res.json())
      .then((response) => {
        submitting = false;
        if (response.code !== 200) {
          showAlert = true;
          message = response.message;
          status = StatusEnum.FAILED;
        } else {
          clearForm();
          showAlert = true;
          message = response.message;
          status = StatusEnum.SUCCESS;
        }
      })
      .catch(() => {
        submitting = false;
        showAlert = true;
        message = "Connection failed";
        status = StatusEnum.FAILED;
      });
  }

  $: port === 25 ? (submitable = false) : (submitable = true);
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="grid w-full grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
    <div>
      <label for="server">SMTP Server</label>
      <input
        class="w-full rounded bg-transparent outline-none"
        id="server"
        type="text"
        placeholder="Address or IP of SMTP server"
        required
        bind:value={server}
      />
      <div
        class="pt-0.5 flex-row flex items-center space-x-1 text-sm text-red-600"
      >
        <button
          class="underline outline-none focus:text-indigo-500"
          on:click={() => changeServer(Provider.SENDGRID)}>Sendgrid</button
        >
        <button
          class="underline outline-none focus:text-indigo-500"
          on:click={() => changeServer(Provider.SPARKPOST)}>Sparkpost</button
        >
        <button
          class="underline outline-none focus:text-indigo-500"
          on:click={() => changeServer(Provider.MAILGUN)}>Mailgun</button
        >
        <button
          class="underline outline-none focus:text-indigo-500"
          on:click={() => changeServer(Provider.GMAIL)}>Gmail</button
        >
      </div>
    </div>
    <div>
      <label for="port">Port</label>
      <input
        class="w-full rounded bg-transparent outline-none"
        class:focus:ring-red-500={port === 25 && true}
        class:focus:border-red-500={port === 25 && true}
        id="port"
        type="number"
        min="2"
        placeholder="Port number of SMTP server"
        required
        bind:value={port}
      />
      <div
        class="pt-0.5 flex-row flex items-center space-x-1 text-sm text-red-600"
      >
        <button
          class="underline outline-none focus:text-indigo-500"
          on:click={() => (port = 465)}>465</button
        >
        <button
          class="underline outline-none focus:text-indigo-500"
          on:click={() => (port = 587)}>587</button
        >
      </div>
    </div>
    <div>
      <label for="username">Username</label>
      <input
        class="w-full rounded bg-transparent outline-none focus:ring-1 focus:ring-blue-700"
        id="username"
        type="text"
        placeholder="Username of SMTP server"
        required
        bind:value={username}
      />
    </div>
    <div>
      <label for="password">Password</label>
      <input
        class="w-full rounded bg-transparent outline-none focus:ring-1 focus:ring-blue-700"
        id="password"
        type="text"
        placeholder="Password of SMTP server"
        required
        bind:value={password}
      />
    </div>
    <div>
      <label for="from">From Email</label>
      <input
        class="w-full rounded bg-transparent outline-none focus:ring-1 focus:ring-blue-700"
        id="from"
        type="email"
        placeholder="The email you want to send as"
        required
        bind:value={from}
      />
    </div>
    <div>
      <label for="to">To Email</label>
      <input
        class="w-full rounded bg-transparent outline-none focus:ring-1 focus:ring-blue-700"
        id="to"
        type="email"
        placeholder="The email you want to send"
        required
        bind:value={to}
      />
    </div>
  </div>
  <button
    class:cursor-not-allowed={!submitable}
    disabled={!submitable}
    type="submit"
    class="bg-blue-600 text-white px-3 py-2 rounded my-2 hover:bg-blue-500 outline-none focus:bg-blue-500 transition-opacity"
    >Start Test
  </button>
</form>

{#if showAlert}
  <Alert {message} {status} bind:visible={showAlert} />
{/if}
