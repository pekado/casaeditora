<script>
  import { articlesStore } from '@/supabase/articles';
  import { router } from 'tinro';
  import { isLoading } from '@/stores/loading';
  import { onDestroy, onMount } from 'svelte';

  let editor;
  let quill;
  let input_img;

  export let toolbarOptions = [
    [{ header: 1 }, { header: 2 }, 'blockquote', 'link', 'image', 'video'],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'ordered' }],
    [{ align: [] }],
    ['clean'],
  ];

  onMount(async () => {
    const { default: Quill } = await import('quill');
    // Quill.register('modules/imageHandler', selectLocalImage);
    quill = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: 'snow',
      placeholder: 'Write your story...',
    });
    quill.getModule('toolbar').addHandler('image', () => {
      selectLocalImage();
    });
  });

  /**
   * Step1. select local image
   *
   */
  function selectLocalImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];

      // file type is only image.
      if (/^image\//.test(file.type)) {
        saveToServer(file);
      } else {
        console.warn('You could only upload images.');
      }
    };
  }

  /**
   * Step2. save to server
   *
   * @param {File} file
   */
  async function saveToServer(file) {
    $isLoading = true;
    const fd = new FormData();
    fd.append('image', file);

    const imgUrl = await articlesStore.addImage(file);
    insertToEditor(imgUrl.Key);
    $isLoading = false;
  }

  /**
   * Step3. insert image url to rich editor.
   *
   * @param {string} url
   */
  function insertToEditor(url) {
    // push image url to rich editor.
    const range = quill.getSelection();
    quill.insertEmbed(
      range.index,
      'image',
      `https://alvsctlgdohilrsrzlhk.supabase.in/storage/v1/object/public/${url}`
    );
  }

  let article = {
    title: '',
    body: '',
    brief: '',
    image_url: '',
  };
  const onCreate = async () => {
    $isLoading = true;
    article.body = quill.root.innerHTML;
    const image_url = await articlesStore.addImage(input_img.files[0]);
    article.image_url = `https://alvsctlgdohilrsrzlhk.supabase.in/storage/v1/object/public/${image_url.Key}`;
    const res = await articlesStore.create(article);
    if (res.error) {
      console.error(error);
    } else {
      router.goto(`/article/${res[0].id}`);
      $isLoading = false;
    }
  };

  onDestroy(() => (quill = ''));
</script>

<svelte:head>
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
</svelte:head>
<button on:click={onCreate}>Crear</button>
<label for="">
  Foto portada
  <input type="file" bind:this={input_img} />
</label>
<label for="">
  Título
  <input type="text" bind:value={article.title} />
</label>
<label for="">
  Brief (resumen)
  <input type="text" bind:value={article.brief} />
</label>
<div class="editor" bind:this={editor} />
