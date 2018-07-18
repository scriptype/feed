import {
  START_GET_LINKS,
  GET_LINKS,
  ERROR_GET_LINKS,

  START_GET_STATS,
  GET_STATS,
  ERROR_GET_STATS
} from './Constants.js'

export default ({ dispatch }, api) => ({
  getLinks({ page }) {
    dispatch(START_GET_LINKS)
    api.getLinks({ page })
      .then(links => {
        dispatch(GET_LINKS, {
          links
        })
      })
      .catch(error => {
        dispatch(ERROR_GET_LINKS, {
          error
        })
      })
  },

  getStats() {
    dispatch(START_GET_STATS)
    api.getStats()
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
