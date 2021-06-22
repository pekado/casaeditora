<script>
  import { Route, router } from 'tinro';
  import db from '@/db';
  // import BoardList from '@/pages/BoardList.svelte';
  import Login from '@/pages/Login.svelte';
  import Register from '@/pages/Register.svelte';
  import Ignea from '@/pages/Ignea.svelte';
  import Home from '@/pages/Home.svelte';
  import Poem from '@/pages/Poem.svelte';
  import NewPoem from '@/pages/NewPoem.svelte';
  import Article from '@/pages/Article.svelte';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';

  let user = db.user;
  console.log($user);
</script>

<header>Casa Editora</header>
<main>
  {#if $user}
    <Route path="/ignea">
      <Ignea />
    </Route>
    <Route path="/ignea/poema/:id" let:meta>
      <Poem id={meta.params.id} user={$user.id} />
    </Route>
    <Route path="/ignea/poema">
      <NewPoem user={$user.id} />
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

<style>
  main {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
</style>
