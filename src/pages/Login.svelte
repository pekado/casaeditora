<script>
  import { fly, fade } from 'svelte/transition';
  import auth from '@/supabase/auth';

  let email, password, error;

  async function submit() {
    const result = await auth.signIn(email, password);
    if (result.error) {
      error = result.error;
    }
    console.log(result.error);
  }

  function focus(element) {
    element.focus();
  }
</script>

<svelte:head>
  <title>Kanban</title>
</svelte:head>

<div class="wrapper">
  <div class="container" in:fade>
    <h1 style="margin-bottom: 30px;">Iniciar sesión</h1>

    <form on:submit|preventDefault={submit}>
      <label>
        <span>Correo electrónico</span>
        <input
          name="email"
          type="email"
          required
          bind:value={email}
          use:focus
        />
      </label>
      <label>
        <span>Contraseña</span>
        <input name="password" type="password" required bind:value={password} />
      </label>
      {#if error}
        <h3 style="color: red;">{error}</h3>
      {/if}
      <div class="center sB" style="margin-top: 10px;">
        <a style="font-size: 14px;" href="/register">Crear usuario</a>
        <button class="primary">
          <span>Iniciar sesión</span>
        </button>
      </div>
    </form>
  </div>
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
