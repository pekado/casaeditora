<script>
  import auth from '@/supabase/auth';
  import { router } from 'tinro';
  import gravatarUrl from 'gravatar-url';

  const user = auth.user;
  const onLogOut = async () => {
    await auth.signOut();
    router.goto('/');
  };
</script>

<header>
  <slot />
  <button on:click={() => auth.signOut()}>Salir</button>

  <!-- <img src={gravatarUrl($user.email, { size: 40 })} alt="Gravatar" /> -->
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
