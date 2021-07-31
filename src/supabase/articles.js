import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.SNOWPACK_PUBLIC_SUPABASE_URL,
  import.meta.env.SNOWPACK_PUBLIC_SUPABASE_KEY
);

const all = async () => {
  const { body } = await supabase.from('articles').select('*').range(0,7);
  return body;
};

const get = async (id) => {
  const { body } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  return body;
};

const create = async (article) => {
  const { body } = await supabase.from('articles').insert(article);

  return body;
};

const update = async (article) => {
  const { body } = await supabase
    .from('articles')
    .update(article)
    .match({ id: article.id });

  return body[0];
};

const addImage = async (image) => {
  const { data, error } = await supabase.storage
    .from('public-images')
    .upload(`${Date.now()}${image.name}`, image);
  return data;
}; 

const articlesStore = {
  get: get,
  update: update,
  all: all,
  create: create,
  addImage: addImage
};

export { articlesStore };