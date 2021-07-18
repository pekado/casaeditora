<script>
  import { fly, fade } from 'svelte/transition';
  import { authStore } from '@/supabase/auth';

  let email,
    password,
    password2,
    name,
    error,
    sent = false;

  async function submit() {
    if (password === password2) {
      const result = await authStore.signUp(email, password);
      if (result.error) {
        error = result.error;
      } else {
        sent = true;
      }
    } else {
      error = 'Las contraseñas no coinciden.';
    }
  }

  function focus(element) {
    element.focus();
  }
</script>

<svelte:head>
  <title>Kanban</title>
</svelte:head>

<div class="wrapper">
  {#if sent}
    <div class="container">
      <div in:fly class="notification">
        <svg
          class="icon"
          height="32"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2>Mira tu mail! Te enviamos un correo para confirmar tu registro.</h2>
      </div>
      <a href="/">Iniciar sesión</a>
    </div>
  {:else}
    <div class="container" in:fade>
      <h1 style="margin-bottom: 30px;">Registrate</h1>

      <form on:submit|preventDefault={submit}>
        <label>
          <span>Nombre o pseudónimo</span>
          <input name="name" type="text" required bind:value={name} use:focus />
          <span>Correo electrónico</span>
          <input
            name="email"
            type="email"
            required
            bind:value={email}
            use:focus
          />
          <span>Contraseña</span>
          <input
            name="password"
            type="password"
            required
            bind:value={password}
          />
          <span>Repite tu contraseña</span>
          <input
            name="password"
            type="password"
            required
            bind:value={password2}
          />
        </label>
        {#if error}
          <h4 style="color: red">{error}</h4>
        {/if}
        <div class="center sB" style="margin-top: 10px;">
          <a style="font-size: 14px;" href="/login ">Iniciar sesión</a>
          <button class="primary">
            <span>Crear usuario!</span>
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
    place-items: center;
    height: 100vh;
    width: 100vw;
  }
  .container {
    display: flex;
    flex-direction: column;
    min-width: 400px;
    padding: 4rem;
    background: #00000021;
    border-radius: 3px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  input {
    display: block;
    width: 100%;
  }
</style>
