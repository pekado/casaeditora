<script>
  import { Route } from 'tinro';
  import db from '@/db';
  import Board from '@/pages/Board.svelte';
  // import BoardList from '@/pages/BoardList.svelte';
  import Login from '@/pages/Login.svelte';
  import Ignea from '@/pages/Ignea.svelte';
  import Home from '@/pages/Home.svelte';
  import Poem from '@/pages/Poem.svelte';
  import Article from '@/pages/Article.svelte';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';

  let user = db.user;
  console.log($user);
</script>

<Header>Casa Editora</Header>
<main>
  {#if $user}
    <Route path="/">
      <Home />
    </Route>
    <Route path="/article/:id" let:meta>
      <Article id={meta.params.id} />
    </Route>
    <Route path="/ignea">
      <Ignea />
    </Route>
    <Route path="/ignea/poema/:id" let:meta>
      <Poem id={meta.params.id} user={$user.id} />
    </Route>
    <!-- <Route path="/boards/:id" let:meta>
    <Board id={meta.params.id} />
  </Route> -->
  {:else}
    <Route path="/">
      <Login />
    </Route>
  {/if}
  <Route fallback>Aw shucks. That couldn't be found.</Route>
  <Footer />
</main>
