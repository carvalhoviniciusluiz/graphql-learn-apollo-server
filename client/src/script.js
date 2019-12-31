const Item = {
  all(fn) {
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
    }).then(response => fn(response))
  },

  save(type, description , fn) {
    if (description) {
      axios({
        url: 'http://localhost:4000',
        method: 'POST',
        data: {
          query: `
            mutation ($item: ItemInput) {
              newPrefix: saveItem (item: $item) {
                id
                type
                description
              }
            }
          `,
          variables: {
            item: {
              type,
              description
            }
          }
        }
      })

      fn()
    }
  },

  // delete(id, fn) {
  //   axios({
  //     url: 'http:localhost:4000',
  //     method: 'POST',
  //     data: {
  //       query: `
  //         mutation ($id: Int) {
  //           deleted: deleteItem (id: $id)
  //         }
  //       `,
  //       variables: {
  //         id
  //       }
  //     }
  //   }).then(() => fn())
  // }
}

const appendChildren = (response) => {
    const query = response.data
    const prefixes = query.data.prefixes
    const sufixes = query.data.sufixes

    console.clear()
    console.log(prefixes)
    console.log(sufixes)

    const createChildren = (items) => items.map(item => {
      const li = document.createElement('li')
      li.textContent = JSON.stringify(item)
      return li
    })

    const appendDOM = (el, children) => {
      const ul = document.querySelector(el)
      ul.innerHTML = ''

      children.map(child => ul.appendChild(child))
    }

    appendDOM('ul#prefixes', createChildren(prefixes))
    appendDOM('ul#sufixes', createChildren(sufixes))
}

Item.all(appendChildren)

const form = document.querySelector('form')
form.addEventListener('submit', event => event.preventDefault())

const addEventClickToButton = (btn, input, type) => {
  const button = document.querySelector(btn)

  button.addEventListener('click', () => {
    const val = document.querySelector(input).value

    Item.save(type, val, () => Item.all(appendChildren))
  })
}

addEventClickToButton('button#prefixes', 'input#prefixes', 'prefix')
addEventClickToButton('button#sufixes', 'input#sufixes', 'sufix')
