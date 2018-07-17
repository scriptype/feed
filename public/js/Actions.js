export default ({ dispatch }, api) => ({
  getLinks({ page }) {
    dispatch({ isLoadingLinks: true })
    api.getLinks({ page })
      .then(links => {
        dispatch({
          links,
          activePage: page,
          isLoadingLinks: false
        })
      })
      .catch(err => {
        dispatch({
          errorGettingStats: err,
          isLoadingLinks: false
        })
      })
  },

  getStats() {
    dispatch({ isLoadingStats: true })
    api.getStats()
      .then(stats => {
        dispatch({
          stats,
          isLoadingStats: false
        })
      })
      .catch(err => {
        dispatch({
          errorGettingStats: err,
          isLoadingStats: false
        })
      })
  }
})
