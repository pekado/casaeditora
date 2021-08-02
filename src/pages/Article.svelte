<script>
  import { articlesStore } from '@/supabase/articles';
  import { onMount } from 'svelte';
  import { isLoading } from '@/stores/loading';

  export let id;
  let article;
  onMount(async () => {
    $isLoading = true;
    const result = await articlesStore.get(id);
    article = result;
    $isLoading = false;
  });
</script>

{#if article}
  <div class="wrapper center sB clmn">
    <img src={article.image_url} alt="" style="height: 400px;" />
    <h1>{article.title}</h1>
    <h3>{article.brief}</h3>
    <img
      style="margin: 64px; width: 100%"
      src={article.img}
      alt={article.image}
    />
    <p>{@html article.body}</p>
  </div>
{/if}

<style>
  .wrapper {
    text-align: center;
  }
  p :global(p) {
    font-weight: normal;
    font-size: 20px;
    line-height: 34px;
  }
  p :global(img) {
    margin: 50px 0;
    width: 100%;
  }
</style>
