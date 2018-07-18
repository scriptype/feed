import appTemplate from './components/App.js'

const container = document.getElementById('list')

let Actions, Store

const init = (actions, store) => {
  Actions = actions
  Store = store

  window.__appEventHandlers = {
    onChangePage(page) {
      Actions.getLinks({ page })
    }
  }

  Actions.getLinks({ page: 1 })
  Actions.getStats()
}

const render = () =>
  container.innerHTML = appTemplate(Store.getState())

export default () =>
  Object.freeze({
    init,
    render
  })
