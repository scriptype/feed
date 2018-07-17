import appTemplate from './components/App.js'

const container = document.getElementById('list')

let Actions, State

const init = (actions, state) => {
  Actions = actions
  State = state

  window.__appEventHandlers = {
    onChangePage(page) {
      Actions.getLinks({ page })
    }
  }

  Actions.getLinks({ page: 1 }),
  Actions.getStats()
}

const render = () =>
  container.innerHTML = appTemplate(State.getState())

export default () =>
  Object.freeze({
    init,
    render
  })
