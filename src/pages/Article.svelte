<script>
  import { articlesStore } from '@/supabase/articles';
  import { onMount } from 'svelte';

  export let id;
  let article;
  onMount(async () => {
    const result = await articlesStore.get(id);
    console.log(result);
    article = result;
  });
</script>

{#if article}
  <div class="wrapper center sB clmn">
    <h1>{article.title}</h1>
    <img style="margin: 64px;" src={article.img} alt={article.image} />
    <p>{@html article.body}</p>
  </div>
{/if}

<style>
  .wrapper {
    text-align: justify;
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
