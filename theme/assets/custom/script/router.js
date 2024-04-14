import { fetchPrefix } from './helpers.js'

const getPaginationPart = (pageNumber) => {
  return pageNumber > 1 ? `/page/${pageNumber}` : '/'
}

export default {
  start(state, onGoBack) {
    window.history.replaceState(state, '', document.location.href)
    window.addEventListener("popstate", onGoBack)
  },

  homepage(state) {
    const path = getPaginationPart(state.pageNumber)
    window.history.pushState(state, '', `${fetchPrefix}${path}`)
  },

  tag(state) {
    const paginationPart = getPaginationPart(state.pageNumber)
    window.history.pushState(state, '', `${fetchPrefix}/tags/${state.tag}${paginationPart}`)
  },

  search(state) {
    window.history.pushState(state, '', `?search=${state.searchQuery}`)
  }
}
