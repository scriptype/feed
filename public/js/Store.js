export default (reducer, emit) => {
  const state = reducer({
    type: '',
    payload: {}
  }, {})

  const dispatch = (type, payload = {}) => {
    console.log('event:', { type, payload })
    const newState = reducer(state, { type, payload })
    Object.assign(state, newState)
    emit()
  }

  const getState = () => state

  return Object.freeze({
    dispatch,
    getState
  })
}
