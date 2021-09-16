<script>
  import { onMount } from 'svelte';
  import { authStore } from '@/supabase/auth';
  import { poemsStore } from '@/supabase/poems';
  import { isLoading } from '@/stores/loading';
  import frequency from '@/utils/word-frecuency';
  import random_rgba from '@/utils/random_rgba';
  import Chart from '@/components/Chart.svelte';
  import { router } from 'tinro';
  $: userStore = $authStore;
  let user = {
    name: '',
    email: '',
  };
  let datasets = [];
  let dataChart = [];
  let labels = [];
  let globalCount = [];
  let poems = [];
  let terms = [];
  onMount(async () => {
    const result = await poemsStore.getByUserId(userStore.id);
    if (result.error) {
      console.error(error);
    } else {
      poems = result.data;
      labels = poems.map((poem) => labels.concat(poem.graph_labels));
    }
    labels = labels.flat();
    globalCount = frequency(labels);
    // array de objetos con data de cada poema
    datasets = poems.map((poem) =>
      Object.assign.apply(
        {},
        poem.graph_labels.map((v, i) => ({ [v]: poem.graph_values[i] }))
      )
    );
    //suma de key iguales
    terms = poems.map((poem) => [terms + poem.graph_labels]);
    datasets = datasets.reduce((result, item) => {
      const keys = Object.keys(item);
      keys.forEach((key) => {
        result[key] = result[key] ? result[key] + item[key] : item[key];
      });
      return result;
    });
    //cortar objecto hasta 20 y borrar los que sean de valor 1
    //TODO
    dataChart = {
      labels: Object.keys(datasets),
      datasets: [
        {
          label: 'Global Count',
          backgroundColor: random_rgba(),
          borderColor: random_rgba(),
          data: Object.values(datasets),
        },
      ],
    };
    $isLoading = false;
  });

  const onUpdate = async () => {
    const result = await authStore.updateUser('benja');
  };
</script>

<h1 on:click={onUpdate}>Tus poemas y sus estadisticas.</h1>
<main class="content">
  {#if poems.length}
    <div class="container">
      {#each poems as poem}
        <a href="/ignea/poema/{poem.id}">
          <div class="poem">
            {poem.title}
          </div>
        </a>
      {/each}
    </div>
    <Chart type="radar" data={dataChart} />
  {:else}
    <div class="content">
      <h2 style="margin-bottom: 30px;">No tienes poemas, agrega uno!</h2>
      <button class="primary" on:click={() => router.goto('/ignea/newpoem')}
        >Nuevo Poema</button
      >
    </div>
  {/if}
</main>

<style>
  .poem {
    text-align: center;
    border: 2px solid var(--main-black);
    margin-bottom: 24px;
    padding: 28px 8px;
    width: 100%;
    max-width: 100%;
  }
  .container {
    display: flex;
    gap: 15px;
    /* column-count: 5;
    column-width: 300px;
    column-gap: 40px; */
  }
</style>
