import { combineReducers, default as createReducer } from './lib/Reducer.js'
import LinksReducer from './reducers/links.js'
import StatsReducer from './reducers/stats.js'
import TagsReducer from './reducers/tags.js'

const reduce = combineReducers([
  LinksReducer,
  StatsReducer,
  TagsReducer
])

const initialState = reduce(true)
const RootReducer = (...args) => reduce(false, ...args)

export default createReducer(initialState, RootReducer)
