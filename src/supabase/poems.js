import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.SNOWPACK_PUBLIC_SUPABASE_URL,
  import.meta.env.SNOWPACK_PUBLIC_SUPABASE_KEY
);

const all = async () => {
  const { body } = await supabase.from('poems').select('*');

  return body;
};

const get = async (id) => {
  const { body } = await supabase
    .from('poems')
    .select('*')
    .eq('id', id)
    .single();

  return body;
};

const create = async (poem) => {
  const { body } = await supabase.from('poems').insert(poem);

  return body;
};

const update = async (poem) => {
  const { body } = await supabase
    .from('poems')
    .update(poem)
    .match({ id: poem.id });

  return body[0];
};

const getByUserId = async (id) => {
  const { data, error } = await supabase
    .from('poems')
    .select('title, graph_labels, id, graph_values')
    .match({'user_id': id});

  return { data, error };
};

const poemsStore = {
  get: get,
  update: update,
  all: all,
  create: create,
  getByUserId: getByUserId,
};

export { poemsStore };
