import { writable } from 'svelte/store';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.SNOWPACK_PUBLIC_SUPABASE_URL,
  import.meta.env.SNOWPACK_PUBLIC_SUPABASE_KEY,
);

const userStore = writable(null);

const getUser = async () => {
  const user = supabase.auth.user()
  userStore.set(user)
}

const updateUser = async (name) => {
  const {data, error} = await supabase.auth.update({
    data:{
      name: name
    }
  })
  return data, error
}

const signUp = async (email, password) => {
  return supabase.auth.signUp({ email: email, password: password });
 
};
const signIn = async (email, password) => {
  const  result =  await supabase.auth.signIn({ email: email, password: password }); 
  userStore.set(supabase.auth.currentUser)
  return result
};
const signOut = () => {
  userStore.set(null)
  return supabase.auth.signOut();
};

const authStore = {
  subscribe: userStore.subscribe,
  signIn: signIn,
  signUp: signUp,
  signOut: signOut,
  getUser: getUser,
  updateUser: updateUser
};

export { authStore };