import { writable } from 'svelte/store'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
	import.meta.env.SNOWPACK_PUBLIC_SUPABASE_URL,
	import.meta.env.SNOWPACK_PUBLIC_SUPABASE_KEY,
)

const userStore = writable(supabase.auth.currentUser)

export default {

	comments: {
		async byPoem(id) {
			const { body } = await supabase
				.from('comments')
				.select('id, body, user_id')
				.eq('poem_id', id)

			return body
		},

		async get(id) {
			const { body } = await supabase
				.from('comments')
				.select('id, title, lists ( id, title, position, cards ( id, description, position ))')
				.eq('id', id)
				.single()

			return body
		},

		async create(board) {
			const { body } = await supabase
				.from('comments')
				.insert(board)

			return body
		},

		async update(board) {
			const { body } = await supabase
				.from('comments')
				.update({ title: board.title })
				.match({ id: board.id })

			return body[0]
		},

	}
}