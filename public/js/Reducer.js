import {
  START_GET_LINKS,
  GET_LINKS,
  ERROR_GET_LINKS,

  START_GET_STATS,
  GET_STATS,
  ERROR_GET_STATS
} from './Constants.js'

const initialState = {
  isLoadingLinks: false,
  errorGetLinks: null,
  activePage: 1,
  links: [],

  isLoadingStats: false,
  errorGetStats: null,
  stats: {
    pages: 0,
    total: 0
  },
}

export default (state, { type, payload }) => {
  switch (type) {
    case GET_LINKS:
      return {
        isLoadingLinks: false,
        errorGetLinks: null,
        activePage: payload.activePage,
        links: payload.links
      }

    case ERROR_GET_LINKS:
      return {
        isLoadingLinks: false,
        errorGetLinks: payload.error
      }

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

    case START_GET_LINKS:
      return {
        isLoadingLinks: true,
        errorGetLinks: null
      }

    default:
      return initialState
  }
}
