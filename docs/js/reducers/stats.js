import createReducer from '../lib/Reducer.js'
import {
  GET_STATS,
  ERROR_GET_STATS
} from '../Constants.js'

const initialState = {
  errorGetStats: null,
  stats: {
    pages: 0,
    total: 0
  },
}

const StatsReducer = (state, { type, payload }) => {
  switch (type) {
    case GET_STATS:
      return {
        errorGetStats: null,
        stats: payload.stats
      }

    case ERROR_GET_STATS:
      return {
        errorGetStats: payload.error
      }

    default:
      return state
  }
}

export default createReducer(initialState, StatsReducer)
