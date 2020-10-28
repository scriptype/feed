import { combineReducers, default as createReducer } from './lib/Reducer.js'
import LinksReducer from './reducers/links.js'
import StatsReducer from './reducers/stats.js'

const reduce = combineReducers([
  LinksReducer,
  StatsReducer
])

const initialState = reduce(true)
const RootReducer = (...args) => reduce(false, ...args)

export default createReducer(initialState, RootReducer)
