<script>
  import { onMount } from 'svelte';
  import { authStore } from '@/supabase/auth';
  $: userStore = $authStore;
  let user = {
    name: '',
    email: '',
  };
  onMount(async () => {});

  const onUpdate = async () => {
    const result = await authStore.updateUser('benja');
    console.log(result, userStore);
  };
</script>

<h1 on:click={onUpdate}>profile</h1>
