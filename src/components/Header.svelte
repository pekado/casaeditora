<script>
  import { authStore } from '@/supabase/auth';
  import { router } from 'tinro';
  import gravatarUrl from 'gravatar-url';

  const user = $authStore;
  const onLogOut = async () => {
    await authStore.signOut();
    router.goto('/');
  };
</script>

<header>
  <slot />
  <button on:click={onLogOut}>Salir</button>

  <!-- <img src={gravatarUrl($user.email, { size: 40 })} alt="Gravatar" /> -->
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
