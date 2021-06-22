<script>
  import { router } from 'tinro';
  import Header from '@/components/Header.svelte';
  import Editor from '@/components/Editor.svelte';
  import edjsHTML from 'editorjs-html';
  import poemsStore from '@/supabase/poems';

  let poem = {
    title: '',
    data: '',
    html: '',
  };
  const edjsParser = edjsHTML();

  async function add() {
    const result = await poemsStore.poems.create(poem);
    router.goto(`/ignea/poema/${result[0].id}`);
  }

  const handleChange = (e) => {
    poem.html = edjsParser.parse(e.detail);
    poem.data = e.detail;
  };
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
    <Editor on:onChange={handleChange} />
  </div>

  <div class="center clmn">
    {#each poem.html as node}
      {@html node}
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
    height: 100%;
  }
</style>
