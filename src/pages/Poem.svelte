<script>
  import { onMount } from 'svelte';
  import InPlaceEdit from '@/components/InPlaceEdit.svelte';
  import Header from '@/components/Header.svelte';
  import { poemsStore } from '@/supabase/poems';
  import commentsStore from '@/supabase/comments';
  import frequency from '@/utils/word-frecuency';
  import random_rgba from '@/utils/random_rgba';
  import Chart from '@/components/Chart.svelte';

  export let user;
  export let id;

  let HTML = [];
  let isOwner = false;
  let isNew = true;
  let isEdit = false;
  let loading = true;
  let comment = '';
  let poem = {
    title: '',
    body: '',
    graph_labels: [],
    graph_values: [],
  };
  let comments = [];
  let dataChart = {};

  onMount(async () => {
    isNew = false;
    const result = await poemsStore.get(id);
    poem = result;
    HTML = poem.html;
    if (user === poem.user_id) {
      isOwner = true;
    }
    const response = await commentsStore.comments.byPoem(id);
    comments = response;
    loading = false;
    dataChart = {
      labels: poem.graph_labels,
      datasets: [
        {
          label: poem.title,
          backgroundColor: random_rgba(),
          borderColor: random_rgba(),
          data: poem.graph_values,
        },
      ],
    };
  });

  async function addComment() {
    const commentResponse = await commentsStore.comments.create({
      body: comment,
      poem_id: id,
    });
    comments = [...comments, commentResponse[0]];
  }

  async function updatePoem() {
    const data = frequency(poem.body, {});
    poem.graph_labels = Object.keys(data);
    poem.graph_values = Object.values(data);
    const res = await poemsStore.update(poem);
    poem = res;
    dataChart = {
      labels: poem.graph_labels,
      datasets: [
        {
          label: poem.title,
          backgroundColor: 'rgba(194, 116, 161, 0.5)',
          borderColor: 'rgb(194, 116, 161)',
          data: poem.graph_values,
        },
      ],
    };
    isEdit = false;
  }

  async function updateTitle({ detail: title }) {
    poem.title = title;
    await poemsStore.update(poem);
    poem = poem;
  }

  const onEdit = () => {
    isEdit = true;
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
        {poem.body}
      {:else if isOwner}
        <textarea name="" bind:value={poem.body} id="" cols="30" rows="10" />
      {/if}
    </div>
    {#if comments.length}
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
          {poem.body}
        {/if}
      </div>
    {/if}
    {#if !isOwner}
      <div class="poema center clmn content">
        <div style="padding-bottom: 12px ;">
          <h4>Comentario</h4>
          <textarea bind:value={comment} name="comment" cols="30" rows="2" />
          <button class="primary" style="float: right;" on:click={addComment}
            >Agregar</button
          >
        </div>
      </div>
    {/if}
  {/if}
</div>
<Chart type="radar" data={dataChart} />

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
    white-space: pre;
  }

  .comment {
    padding: 12px;
    border: 1px solid var(--secondary-black);
    width: 100%;
  }
</style>
