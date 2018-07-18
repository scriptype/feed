import appTemplate from './components/App.js'

const container = document.getElementById('app')

let Actions, Store

const init = (actions, store) => {
  Actions = actions
  Store = store

  window.__appEventHandlers = {
    onChangePage(page, event) {
      Actions.getLinks({ page })
        .then(() => {
          if (!event) {
            return
          }
          const focusable = (
            event.target.nodeName === 'BUTTON' ||
            event.target.nodeName === 'A'
          )
          if (focusable) {
            const element = document.getElementById(event.target.id)
            element.focus()
          }
        })
    }
  }

  Actions.getLinks({ page: 1 })
  Actions.getStats()
}

const render = () => {
  container.innerHTML = appTemplate(Store.getState())
}

export default () =>
  Object.freeze({
    init,
    render
  })
