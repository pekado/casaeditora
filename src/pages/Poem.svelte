<script>
  import { onMount } from 'svelte';
  import InPlaceEdit from '@/components/InPlaceEdit.svelte';
  import Header from '@/components/Header.svelte';
  import edjsHTML from 'editorjs-html';
  import poemsStore from '@/supabase/poems';
  import commentsStore from '@/supabase/comments';
  import Editor from '@/components/Editor.svelte';

  export let user;
  export let id;

  const edjsParser = edjsHTML();
  let HTML = [];
  let isOwner = false;
  let isNew = true;
  let isEdit = false;
  let loading = true;
  let comment = '';
  let poem = {
    title: '',
    body: '',
  };
  let comments = [];

  onMount(async () => {
    isNew = false;
    const result = await poemsStore.poems.get(id);
    poem = result;
    HTML = JSON.parse(poem.html);
    if (user === poem.user_id) {
      isOwner = true;
    }
    const response = await commentsStore.comments.byPoem(id);
    comments = response;
    loading = false;
  });

  async function addComment() {
    const commentResponse = await commentsStore.comments.create({
      body: comment,
      poem_id: id,
    });
    comments = [...comments, commentResponse[0]];
  }

  async function updatePoem() {
    await poemsStore.poems.update(poem);
    isEdit = false;
  }

  async function updateTitle({ detail: title }) {
    poem.title = title;
    await poemsStore.poems.update(poem);
    poem = poem;
  }

  const onEdit = () => {
    isEdit = true;
  };

  const handleChange = (e) => {
    HTML = edjsParser.parse(e.detail);
    poem.data = e.detail;
    poem.html = HTML;
  };
</script>

<svelte:head>
  <title>{poem?.title}</title>
</svelte:head>

<Header>
  {#if isOwner}
    <InPlaceEdit bind:value={poem.title} on:submit={updateTitle} />
    {#if isEdit}
      <button class="primary" on:click={updatePoem}>Guardar</button>
    {:else}
      <button class="secondary" on:click={onEdit}>Editar</button>
    {/if}
  {:else}
    <h1>{poem.title}</h1>
  {/if}
</Header>

<div class="content">
  {#if loading}
    Loading...
  {:else}
    <div class="poema center clmn content">
      {#if !isEdit}
        {#each HTML as node}
          {@html node}
        {/each}
      {:else if isOwner}
        <Editor data={poem.data} on:onChange={handleChange} />
      {/if}
    </div>
    <div class="poema center clmn content">
      {#if !isEdit}
        <div class="content clmn" style="width: 100%; text-align: center;">
          {#each comments as comment}
            <div class="comment">
              <p>{comment.body}</p>
            </div>
          {/each}
        </div>
      {:else}
        Vista previa:
        {#each HTML as node}
          {@html node}
        {/each}
      {/if}
      {#if !isOwner}
        <div style="padding-bottom: 12px ;">
          <h4>Comentario</h4>
          <textarea bind:value={comment} name="comment" cols="30" rows="2" />
          <button class="primary" style="float: right;" on:click={addComment}
            >Agregar</button
          >
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .content {
    display: flex;
    overflow-y: auto;
    /* height: 100%; */
  }

  .poema {
    font-size: 17px;
    line-height: 30px;
    width: 60%;
    align-items: baseline;
  }

  .right {
    border-left: 2px solid var(--secondary-gray);
    width: 40%;
    text-align: center;
  }

  .comment {
    padding: 12px;
    border: 1px solid var(--secondary-black);
    width: 100%;
  }
</style>
