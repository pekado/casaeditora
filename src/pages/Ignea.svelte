<script>
  import Header from '@/components/Header.svelte';
  import { onMount } from 'svelte';
  import poemsStore from '@/supabase/poems';
  import { router } from 'tinro';

  let poems = [];
  let loading = true;
  let title = 'tt';
  let body = 'bb';

  onMount(async () => {
    poems = await poemsStore.poems.all();
    loading = false;
  });
</script>

<svelte:head>
  <title>poems</title>
</svelte:head>

<Header>poems</Header>

<main>
  <ul>
    {#each poems as poem}
      <li>
        <a href="/ignea/poema/{poem.id}">{poem.title}</a>
      </li>
    {/each}

    <li class="add">
      <a href="/ignea/poema"
        >{poems.length == 0 ? 'Add a poem' : 'Add another poem'}</a
      >
    </li>
  </ul>
</main>

<style>
  ul {
    margin: 1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  li {
    background: #fff7;
    border-radius: 3px;
  }

  li a,
  li button {
    display: block;
    height: 150px;
    min-width: 150px;
    padding: 1rem;
    transition: all 0.3s ease-in-out;
  }

  li.add {
    background: #fff5;
  }

  li a {
    display: block;
    color: #444;
    text-decoration: none;
  }

  li a:hover,
  li button:hover {
    background: #fff8;
  }
</style>
