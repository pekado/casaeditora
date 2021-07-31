<script>
  import { onMount } from 'svelte';
  import { articlesStore } from '@/supabase/articles';

  let articles;
  onMount(async () => {
    const result = await articlesStore.all();
    articles = result;
  });
</script>

{#if articles}
  <div class="wrapper center sB clmn">
    <div class="front-page">
      <img src={articles[0].img} alt={articles[0].image} />
      <h1>{articles[0].title}</h1>
      <p>{articles[0].subtitle}</p>
      <hr
        style="height: 2px;
    width: 300px;
    margin: 34px auto"
      />
    </div>
    <h2 style="margin-bottom: 64px;">Artículos</h2>
    <div class="grid">
      {#each articles as article}
        <div>
          <img src={article.img} alt={article.img} />
          <p>{article.title}</p>
        </div>
      {/each}
    </div>
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
    grid-template-rows: 1fr 1fr 1fr;
    gap: 64px 28px;
  }
  .grid img {
    width: 304px;
  }
</style>
