<script>
  import InPlaceEdit from '@/components/InPlaceEdit.svelte';
  import Header from '@/components/Header.svelte';
  import Editor from '@/components/Editor.svelte';
  import edjsHTML from 'editorjs-html';
  import poemsStore from '@/supabase/poems';

  let poem = {
    title: '',
    data: '',
    html: '',
  };
  let HTML = [];
  const edjsParser = edjsHTML();

  async function updateTitle({ detail: title }) {
    poem.title = title;
    await poemsStore.poems.update(poem);
    poem = poem;
  }

  async function add() {
    const board = await poemsStore.poems.create(poem);

    // router.goto(`/poems/${board.id}`);
  }

  const handleChange = (e) => {
    poem.html = edjsParser.parse(e.detail);
    poem.data = e.detail;
    console.log(poem.data);
  };
</script>

<svelte:head>
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
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
