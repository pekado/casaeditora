<script>
  import { articlesStore } from '@/supabase/articles';
  import { router } from 'tinro';
  import { onMount } from 'svelte';

  let editor;
  let quill;

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
    const fd = new FormData();
    fd.append('image', file);

    const imgUrl = await articlesStore.addImage(file);
    insertToEditor(imgUrl.Key);
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

  // quill editor add image handler
  // editor.getModule('toolbar').addHandler('image', () => {
  //   selectLocalImage();
  // });

  let article = {
    title: '',
    body: '',
  };
  const onCreate = async () => {
    article.body = quill.root.innerHTML;
    const res = await articlesStore.create(article);
    if (res.error) {
      console.error(error);
    } else {
      router.goto(`/article/${res[0].id}`);
    }
  };
</script>

<svelte:head>
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
</svelte:head>
<button on:click={onCreate}>Crear</button>
<input type="file" bind:value={article.img} />
<input type="text" bind:value={article.title} />
<input type="text" bind:value={article.brief} />
<div class="editor" bind:this={editor} />
