<script>
  import { onMount } from 'svelte';
  import InPlaceEdit from '@/components/InPlaceEdit.svelte';
  import Header from '@/components/Header.svelte';
  import { quill } from '../utils/editor.js';
  import edjsHTML from 'editorjs-html';
  import poemsStore from '@/supabase/poems';
  import commentsStore from '@/supabase/comments';
  import Editor from '@/components/Editor.svelte';

  export let user;
  export let id;

  const edjsParser = edjsHTML();
  let HTML = [];
  const flipDurationMs = 200;
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
  let options = {
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'code-block'],
      ],
    },
    placeholder: 'Type something...',
    theme: 'snow',
  };

  onMount(() => {
    isNew = false;
    poemsStore.poems
      .get(id)
      .then((result) => {
        poem = result;
        HTML = JSON.parse(poem.html);
      })
      .then(() => {
        if (user === poem.user_id) {
          isOwner = true;
        }
      })
      .then(() => {
        commentsStore.comments.byPoem(id).then((result) => {
          comments = result;
          loading = false;
        });
      });
  });

  async function addComment() {
    const commentResponse = await commentsStore.comments.create({
      body: comment,
      poem_id: id,
    });
    console.log(commentResponse);
    comments = [...comments, commentResponse[0]];

    // router.goto(`/poems/${board.id}`);
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
    // console.log(content);
  };

  const handleChange = (e) => {
    HTML = edjsParser.parse(e.detail);
    poem.data = e.detail;
    poem.html = HTML;
  };
</script>

<svelte:head>
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
  <title>{poem?.title}</title>
</svelte:head>

<Header>
  {#if isOwner}
    <div style="width: 100%" class="center sB">
      <div />
      <InPlaceEdit bind:value={poem.title} on:submit={updateTitle} />
      {#if isEdit}
        <button class="primary" on:click={updatePoem}>Guardar</button>
      {:else}
        <button class="secondary" on:click={onEdit}>Editar</button>
      {/if}
    </div>
  {:else}
    <h1>{poem.title}</h1>
  {/if}
</Header>

<div class="container">
  {#if loading}
    Loading...
  {:else}
    <div style="width: 60%;">
      {#if !isEdit}
        {#each HTML as node}
          {@html node}
        {/each}
      {:else if isOwner}
        <Editor data={poem.data} on:onChange={handleChange} />
      {/if}
    </div>
  {/if}
  {#if !isEdit}
    <div class="center clmn">
      {#each comments as comment}
        <p>{comment.body}</p>
      {/each}
      <div>
        <h4>Comentario</h4>
        <textarea bind:value={comment} name="comment" cols="30" rows="5" />
        <button class="primary" style="float: right;" on:click={addComment}
          >Agregar</button
        >
      </div>
    </div>
  {:else}
    <div>
      Vista previa:
      {#each HTML as node}
        {@html node}
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    height: 100%;
  }
</style>
