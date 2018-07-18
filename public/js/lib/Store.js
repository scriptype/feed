import { isDev } from './utils.js'

const log = (title, ...args) => {
  if (isDev()) {
    console.groupCollapsed(title)
    console.log(...args)
    console.groupEnd(title)
  }
}

export default (reducer, emit) => {
  const state = reducer.initialState

  const dispatch = (type, payload = {}) => {
    log(`👉 ${type}`, 'payload', JSON.stringify(payload, null, 2))
    const newState = reducer.reduce(state, { type, payload })
    Object.assign(state, newState)
    emit()
  }

  const getState = () => state

  return Object.freeze({
    dispatch,
    getState
  })
}
