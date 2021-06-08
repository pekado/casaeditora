<script>
  import { onMount } from 'svelte';
  import InPlaceEdit from '@/components/InPlaceEdit.svelte';
  import Header from '@/components/Header.svelte';
  import { quill } from '../utils/editor.js';
  import poemsStore from '@/supabase/poems';
  import commentsStore from '@/supabase/comments';

  export let user;
  export let id;
  const flipDurationMs = 200;
  let isOwner = false;
  let isNew = true;
  let isEdit = false;
  let loading = true;
  let content = { html: '', text: '' };
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

  async function add() {
    const board = await commentsStore.comments.create({
      body: 'sdas',
      poem_id: id,
    });

    // router.goto(`/poems/${board.id}`);
  }

  async function getComments(id) {}

  async function createUpdatePoem() {
    poem.body = content.text;
    poem.html = content.html;
    console.log(poem);
    if (poem.id) {
      await poemsStore.poems.update(poem);
      isEdit = false;
    } else {
      await poemsStore.comment.create(poem, {
        title: detail.title,
      });
    }
  }

  async function updateTitle({ detail: title }) {
    poem.title = title;
    await poemsStore.poems.update(poem);
    poem = poem;
    console.log(content);
  }

  const onEdit = () => {
    isEdit = true;
    content.text = poem.body;
    content.html = poem.html;
    // console.log(content);
  };
</script>

<svelte:head>
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
  <title>{poem?.title}</title>
</svelte:head>

<Header>
  {#if isOwner}
    <InPlaceEdit bind:value={poem.title} on:submit={updateTitle} />
    {#if isEdit}
      <button class="primary" on:click={createUpdatePoem}>Guardar</button>
    {:else}
      <button class="secondary" on:click={onEdit}>Editar</button>
    {/if}
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
        <p style="white-space: break-spaces;">{poem.body}</p>
      {:else if isOwner}
        <div
          style="white-space: break-spaces;"
          class="editor"
          use:quill={options}
          on:text-change={(e) => (content = e.detail)}
        >
          {isEdit && poem.bodyº}
        </div>
      {/if}
    </div>
  {/if}
  {#if !isEdit}
    <div class="center clmn">
      {#each comments as comment}
        <p>{comment.body}</p>
      {/each}
      <button on:click={add}>comentario</button>
    </div>
  {:else}
    <div>
      Resulting HTML:
      {@html content.html}
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    height: 100%;
  }
</style>
