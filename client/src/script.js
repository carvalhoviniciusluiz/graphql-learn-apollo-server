const fetch = () => {
  axios({
      url: 'http://localhost:4000',
      method: 'POST',
      data: {
          query: `
            {
                prefixes: items (type: "prefix") {
                    id
                    type
                    description
                }
                sufixes: items (type: "sufix") {
                    description
                }
            }
          `
      }
  }).then(response => {
      const query = response.data

      const prefixes = query.data.prefixes
      const sufixes = query.data.sufixes

      console.log(prefixes)
      console.log(sufixes)

      const createItems = (items) => items.map(item => {
        const li = document.createElement('li')
        li.textContent = JSON.stringify(item)
        return li
      })

      const appendDOM = (el, children) => {
        const ul = document.querySelector(el)

        children.map(child => ul.appendChild(child))
      }

      appendDOM('ul#prefixes', createItems(prefixes))
      appendDOM('ul#sufixes', createItems(sufixes))

  })
};

fetch();
