import createApi from './api.js'

const api = createApi({ baseUrl: '' })

const container = document.getElementById('list')

const createState = (defaults, onChange) => ({
  ...defaults,
  update(newState) {
    Object.assign(this, newState)
    onChange(this)
  }
})

const App = {
  render(state) {
    container.innerHTML = appTemplate(state)
  }
}

const State = createState({
  links: [],
  stats: {
    pages: 0,
    total: 0
  }
}, App.render.bind(App))

const appTemplate = state => `
  <div class="app-container">
    ${linksTemplate(state.links)}
    ${paginationTemplate(state.stats)}
  </div>
`

const linksTemplate = links => `
  <div class="links">
    ${ links.map(link => `
      <div class="link-container">
        <a target="_blank" href="${link.url}">${link.title}</a>
      </div>
    `).join('') }
  </div>
`

const paginationTemplate = stats => `
  <div class="pagination">
    ${ [...Array(stats.pages + 1).keys()].slice(1).map(page => `
      <button
        type="button"
        class="pagination-button"
        onclick="__appEventHandlers.onChangePage(${page})"
      >
        ${page}
      </button>
    `).join('') }
  </div>
`

window.__appEventHandlers = {
  onChangePage(page) {
    api.getLinks({ page })
  }
}

Promise.all([
  api.getLinks({ page: 1 }),
  api.getStats()
])
  .then(([ links, stats ]) => {
    State.update({
      links,
      stats
    })
  })
  .catch(err => {
    console.error('error', err)
  })
