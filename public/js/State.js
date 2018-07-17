export default (defaults, emit) => {
  const data = {
    ...defaults
  }

  const dispatch = newState => {
    Object.assign(data, newState)
    emit()
  }

  const getState = () => data

  return Object.freeze({
    dispatch,
    getState
  })
}
