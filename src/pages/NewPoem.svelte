<script>
  import { router } from 'tinro';
  import Header from '@/components/Header.svelte';
  import frequency from '@/utils/word-frecuency';
  import { poemsStore } from '@/supabase/poems';

  let poem = {
    title: '',
    body: '',
    graph_data: {},
  };

  async function add() {
    const data = frequency(poem.body, {});
    poem.graph_data = data;
    const result = await poemsStore.create(poem);
    router.goto(`/ignea/poema/${result[0].id}`);
  }
</script>

<svelte:head>
  <title>{poem?.title}</title>
</svelte:head>

<Header>
  <div style="width: 100%" class="center sB">
    <div />
    <input type="text" placeholder="Agrega un títlo" bind:value={poem.title} />
    <button class="secondary" on:click={add}>Guardar</button>
  </div>
</Header>
<div class="container">
  <div style="width: 60%;">
    <textarea name="" bind:value={poem.body} id="" cols="30" rows="10" />
  </div>

  <div class="center clmn" style="white-space: pre;">
    {poem.body}
  </div>
</div>

<style>
  .container {
    display: flex;
    height: 100%;
  }
</style>
