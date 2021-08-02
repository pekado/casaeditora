<script>
  import { onMount } from 'svelte';
  import { articlesStore } from '@/supabase/articles';
  import { isLoading } from '@/stores/loading';

  let articles;
  let page = 0;
  onMount(async () => {
    $isLoading = true;
    await onGet();
    $isLoading = false;
  });

  const onGet = async () => {
    const result = await articlesStore.all(page);
    articles = result.data;
    page = result.page;
  };
</script>

{#if articles}
  <div class="wrapper center sB clmn">
    <div class="front-page">
      <a href={`/article/${articles[0].id}`}>
        <img
          src={articles[0].image_url}
          alt={articles[0].image_url}
          style="height: 400px;"
        />
        <h1>{articles[0].title}</h1>
        <p>{articles[0].subtitle}</p>
      </a>
      <hr
        style="height: 2px;
    width: 300px;
    margin: 34px auto"
      />
    </div>
    <h2 style="margin-bottom: 64px;">Artículos</h2>
    <div class="grid">
      {#each articles as article}
        <a href={`/article/${article.id}`}>
          <div>
            <img src={article.image_url} alt={article.img} />
            <p>{article.title}</p>
          </div>
        </a>
      {/each}
    </div>
    <button on:click={onGet}>Next</button>
  </div>
{/if}

<style>
  .wrapper {
    margin: 80px 0;
    text-align: center;
  }

  .front-page {
    margin-bottom: 64px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* grid-template-rows: 1fr 1fr 1fr; */
    gap: 64px 28px;
  }
  .grid img {
    width: 304px;
  }
</style>
