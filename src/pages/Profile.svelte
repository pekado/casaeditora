<script>
  import { onMount } from 'svelte';
  import { authStore } from '@/supabase/auth';
  import { poemsStore } from '@/supabase/poems';
  import Chart from '@/components/Chart.svelte';
  $: userStore = $authStore;
  let user = {
    name: '',
    email: '',
  };
  let dataChart = [];
  let poems = [];
  onMount(async () => {
    const result = await poemsStore.getByUserId(userStore.id);
    if (result.error) {
      console.error(error);
    } else {
      poems = result.data;
      console.log(poems);
    }
  });

  const onUpdate = async () => {
    const result = await authStore.updateUser('benja');
  };
</script>

<h1 on:click={onUpdate}>profile</h1>
<main class="content">
  <div class="container">
    {#each poems as poem}
      <a href="/ignea/poema/{poem.id}">
        <div class="poem">
          {poem.title}
        </div>
      </a>
    {/each}

    <!-- <div class="add">
      <a href="/ignea/poema"
        >{poems.length == 0 ? 'Add a poem' : 'Add another poem'}</a
      >
    </div> -->
  </div>
  <!-- <Chart type="radar" data={poem.graph_data} /> -->
</main>

<style>
  .poem {
    text-align: center;
    border: 2px solid var(--main-black);
    margin-bottom: 24px;
    padding: 28px 8px;
    width: 100%;
    max-width: 100%;
  }
  .container {
    display: flex;
    gap: 15px;
    /* column-count: 5;
    column-width: 300px;
    column-gap: 40px; */
  }
</style>
