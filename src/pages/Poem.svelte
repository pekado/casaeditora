<script>
  import { onMount } from 'svelte';
  import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
  import { fade } from 'svelte/transition';
  import { cubicIn } from 'svelte/easing';
  import List from '@/components/List.svelte';
  import AddList from '@/components/AddList.svelte';
  import InPlaceEdit from '@/components/InPlaceEdit.svelte';
  import Header from '@/components/Header.svelte';
  import poemsStore from '@/supabase/poems';
  import commentsStore from '@/supabase/comments';

  const flipDurationMs = 200;
  let loading = true;
  let poem;
  let comments = [];

  export let id;

  onMount(() => {
    poemsStore.poems.get(id).then((result) => {
      poem = result;
    });
    commentsStore.comments.byPoem(id).then((result) => {
      console.log(result, id);
      comments = result;
      loading = false;
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

  async function addList({ detail }) {
    const list = await poemsStore.comment.create(poem, {
      title: detail.title,
      position: poem.comment.length,
    });

    poem.comment.push(list);
    poem = poem;
  }

  async function updateTitle({ detail: title }) {
    poem.title = title;
    await poemsStore.poems.update(poem);
    poem = poem;
  }

  function handleSort(e) {
    poem.comment = e.detail.items;
    poem = poem;
  }

  async function updateSort(e) {
    poem.comment = e.detail.items;
    poem = poem;

    await poemsStore.poems.sort(poem);
  }

  function transformDraggedElement(element) {
    element.classList.add('list-dragging');
  }
</script>

<svelte:head>
  <title>{poem?.title}</title>
</svelte:head>

<Header>
  {#if poem}
    <InPlaceEdit bind:value={poem.title} on:submit={updateTitle} />
  {/if}
</Header>

<main>
  {#if loading}
    Loading...
  {:else}
    <button on:click={add}>comentario</button>
    <p>{poem.title}</p>
    <!-- <div use:dndzone={{items: poem.comment, flipDurationMs, dropTargetStyle: '', transformDraggedElement, type: 'poem'}} on:consider={handleSort} on:finalize={updateSort}>
        {#each poem.comment as list (list.id)}
          <List {list} collapse={list[SHADOW_ITEM_MARKER_PROPERTY_NAME]}/>
  
          {#if list[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
            <div in:fade={{duration: 200, easing: cubicIn}} class='drag-shadow'>
              <List {list} shadow={true}/>
            </div>
          {/if}
        {/each}
      </div>
  
      <AddList first={poem.comment.length == 0} on:add={addList}/> -->
  {/if}
  {#each comments as comment}
    <p>{comment.body}</p>
  {/each}
</main>

<style>
  main {
    margin: 1rem;
  }

  main,
  main > div {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  :global(.list-dragging) {
    outline: none;
  }

  .drag-shadow {
    visibility: visible;
    background: #ccc;
    border-radius: 3px;
    opacity: 0.3;
    margin: 0;
    color: transparent;
  }
</style>
