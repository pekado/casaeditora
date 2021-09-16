<script>
  import { onMount } from 'svelte';
  import { poemsStore } from '@/supabase/poems';
  import { isLoading } from '@/stores/loading';

  let poems = [];

  onMount(async () => {
    $isLoading = true;
    poems = await poemsStore.all();
    $isLoading = false;
  });
</script>

<svelte:head>
  <title>poems</title>
</svelte:head>

<main class="content">
  <div class="container">
    {#each poems as poem}
      <a href="/ignea/poema/{poem.id}">
        <div class="poem">
          {poem.title}
        </div>
        <ul>
          <li />
        </ul>
      </a>
    {/each}
  </div>
</main>

<style>
  .poem {
    text-align: center;
    border: 2px solid var(--main-black);
    margin-bottom: 24px;
    padding: 28px 8px;
    width: 300px;
    max-width: 100%;
  }
  .container {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    margin: auto auto;
    /* column-count: 5;
    column-width: 300px;
    column-gap: 40px; */
  }
</style>
