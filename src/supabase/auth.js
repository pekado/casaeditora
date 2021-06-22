import { writable } from 'svelte/store'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.SNOWPACK_PUBLIC_SUPABASE_URL,
  import.meta.env.SNOWPACK_PUBLIC_SUPABASE_KEY,
)

const userStore = writable(supabase.auth.currentUser)

export default {

  get user() {
    return userStore
  },
  signUp(email, password) {
    return supabase.auth.signUp({ email: email, password: password })
  },
  signIn(email, password) {
    return supabase.auth.signIn({ email: email, password: password })
  },
  signOut() {
    return supabase.auth.signOut()
  }

}