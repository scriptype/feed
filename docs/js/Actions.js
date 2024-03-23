import {
  GET_LINKS,
  ERROR_GET_LINKS,

  GET_STATS,
  ERROR_GET_STATS,

  GET_TAGS,
  ERROR_GET_TAGS,
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
  },

  getTags() {
    return api.getTags()
      .then(tags => {
        dispatch(GET_TAGS, {
          tags
        })
      })
      .catch(error => {
        dispatch(ERROR_GET_TAGS, {
          error
        })
      })
  }
})
