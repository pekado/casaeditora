<script>
  import { onMount } from 'svelte';
  import { Route, router } from 'tinro';
  import { authStore } from '@/supabase/auth';
  // import BoardList from '@/pages/BoardList.svelte';
  import Login from '@/pages/Login.svelte';
  import Register from '@/pages/Register.svelte';
  import Ignea from '@/pages/Ignea.svelte';
  import Profile from '@/pages/Profile.svelte';
  import Home from '@/pages/Home.svelte';
  import Poem from '@/pages/Poem.svelte';
  import NewPoem from '@/pages/NewPoem.svelte';
  import Article from '@/pages/Article.svelte';
  import NewArticle from '@/pages/NewArticle.svelte';
  import Footer from '@/components/Footer.svelte';
  import Spinner from '@/components/Spinner.svelte';
  import { isLoading } from './stores/loading';
  import Header from '@/components/Header.svelte';

  $: user = $authStore;

  onMount(() => {
    setTimeout(() => {
      authStore.getUser();
      console.log(user);
    }, 100);
  });
</script>

<div>
  {#if $isLoading}
    <Spinner />
  {/if}
  <a href="/"><header style="font-size: xx-large;">Casa Editora</header></a>
  <Header>poems</Header>
  <main>
    {#if user}
      <Route path="/ignea">
        <Ignea />
      </Route>
      <Route path="/ignea/poema/:id" let:meta>
        <Poem id={meta.params.id} user={user.id} />
      </Route>
      <Route path="/ignea/newpoem">
        <NewPoem user={user.id} />
      </Route>
      <Route path="/ignea/profile">
        <Profile />
      </Route>
      <Route path="/newarticle">
        <NewArticle />
      </Route>
      <!-- <Route path="/boards/:id" let:meta>
      <Board id={meta.params.id} />
    </Route> -->
    {:else}
      <Route path="/login">
        <Login />
      </Route>
    {/if}
    <Route path="/register">
      <Register />
      <Footer />
    </Route>
    <Route path="/">
      <Home />
      <Footer />
    </Route>
    <Route path="/article/:id" let:meta>
      <Article id={meta.params.id} />
      <Footer />
    </Route>
    <Route fallback>Aw shucks. That couldn't be found.</Route>
  </main>
</div>

<style>
  main {
    /* display: flex; */
    min-height: 100vh;
    flex-direction: column;
  }
</style>
