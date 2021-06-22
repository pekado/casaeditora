import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.SNOWPACK_PUBLIC_SUPABASE_URL,
  import.meta.env.SNOWPACK_PUBLIC_SUPABASE_KEY,
)

export default {

  poems: {
    async all() {
      const { body } = await supabase
        .from('poems')
        .select('*')

      return body
    },

    async get(id) {
      const { body } = await supabase
        .from('poems')
        .select('*')
        .eq('id', id)
        .single()

      return body
    },

    async create(poem) {
      const { body } = await supabase
        .from('poems')
        .insert(poem)

      return body
    },

    async update(poem) {
      const { body } = await supabase
        .from('poems')
        .update(poem)
        .match({ id: poem.id })

      return body[0]
    },

    async sort(poem) {
      const { body } = await supabase
        .rpc('sort_poem', {
          poem_id: poem.id,
          list_ids: poem.lists.map(list => list.id)
        })

      return body
    }
  }
}