<script>
  import { authStore } from '@/supabase/auth';
  import { router } from 'tinro';

  const onLogOut = async () => {
    await authStore.signOut();
    router.goto('/');
  };
</script>

<header>
  <a href="/ignea">IGNEA</a>
  {#if $authStore}
    <a href="/ignea/newpoem">Nuevo poema</a>
    <a href="/ignea/profile">Perfil</a>
    <button on:click={onLogOut}>Salir</button>
  {:else}
    <a href="/login">Ingresar</a>
  {/if}

  <!-- <img src={gravatarUrl($user.email, { size: 40 })} alt="Gravatar" /> -->
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
