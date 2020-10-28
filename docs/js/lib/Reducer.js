export function combineReducers(reducers) {
  return (isInitial, state, action) => {
    return reducers.reduce((result, reducer) => {
      const reducerData = isInitial
        ? reducer.initialState
        : reducer.reduce(result, action)
      return Object.assign({}, result, reducerData)
    }, {})
  }
}

export default (initialState, reduce) => ({
  initialState,
  reduce
})
