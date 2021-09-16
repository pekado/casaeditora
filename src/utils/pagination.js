const getPagination = (page, size) => {
    const limit = size ? size : 6;
    const from = page ? page * limit : 0;
    const to = page ? from + size : size;
    return { from, to };
  };

  export default getPagination;