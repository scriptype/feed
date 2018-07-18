import createReducer from '../lib/Reducer.js'
import {
  START_GET_STATS,
  GET_STATS,
  ERROR_GET_STATS
} from '../Constants.js'

const initialState = {
  isLoadingStats: false,
  errorGetStats: null,
  stats: {
    pages: 0,
    total: 0
  },
}

const StatsReducer = (state, { type, payload }) => {
  switch (type) {
    case START_GET_STATS:
      return {
        isLoadingStats: true,
        errorGetStats: null
      }

    case GET_STATS:
      return {
        isLoadingStats: false,
        errorGetStats: null,
        stats: payload.stats
      }

    case ERROR_GET_STATS:
      return {
        isLoadingStats: false,
        errorGetStats: payload.error
      }

    default:
      return state
  }
}

export default createReducer(initialState, StatsReducer)
