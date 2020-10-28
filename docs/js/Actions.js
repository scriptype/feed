import {
  GET_LINKS,
  ERROR_GET_LINKS,

  GET_STATS,
  ERROR_GET_STATS
} from './Constants.js'

export default ({ dispatch }, api) => ({
  getLinks({ page }) {
    return api.getLinks({ page })
      .then(links => {
        dispatch(GET_LINKS, {
          links,
          page
        })
      })
      .catch(error => {
        dispatch(ERROR_GET_LINKS, {
          error
        })
      })
  },

  getStats() {
    return api.getStats()
      .then(stats => {
        dispatch(GET_STATS, {
          stats
        })
      })
      .catch(error => {
        dispatch(ERROR_GET_STATS, {
          error
        })
      })
  }
})
