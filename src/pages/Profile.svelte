<script>
  import { onMount } from 'svelte';
  import { authStore } from '@/supabase/auth';
  import { poemsStore } from '@/supabase/poems';
  import frequency from '@/utils/word-frecuency';
  import random_rgba from '@/utils/random_rgba';
  import Chart from '@/components/Chart.svelte';
  $: userStore = $authStore;
  let user = {
    name: '',
    email: '',
  };
  let datasets = [];
  let dataChart = [];
  let labels = [];
  let globalCount = {};
  let poems = [];
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
    console.log(Object.values(globalCount));
    // labels = Object.keys(data).slice(0, 20);
    datasets = poems.map((poem) => [
      ...datasets,
      {
        label: poem.title,
        backgroundColor: random_rgba(),
        borderColor: random_rgba(),
        data: poem.graph_values,
      },
    ]);

    datasets = datasets.flat();
    dataChart = {
      labels: Object.keys(globalCount),
      datasets: [
        {
          label: 'Global Count',
          backgroundColor: random_rgba(),
          borderColor: random_rgba(),
          data: Object.values(globalCount),
        },
      ],
    };
  });

  const onUpdate = async () => {
    const result = await authStore.updateUser('benja');
  };
</script>

<h1 on:click={onUpdate}>profile</h1>
<main class="content">
  <div class="container">
    {#each poems as poem}
      <a href="/ignea/poema/{poem.id}">
        <div class="poem">
          {poem.title}
        </div>
      </a>
    {/each}

    <!-- <div class="add">
      <a href="/ignea/poema"
        >{poems.length == 0 ? 'Add a poem' : 'Add another poem'}</a
      >
    </div> -->
  </div>
  <Chart type="radar" data={dataChart} />
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
