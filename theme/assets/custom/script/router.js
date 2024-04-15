import { fetchPrefix } from './helpers.js'

const getPaginationPart = (pageNumber) => {
  return pageNumber > 1 ? `/page/${pageNumber}` : '/'
}

export default {
  debug: false,

  logState(...msg) {
    if (this.debug) {
      console.info(...msg)
    }
  },

  start(state, onGoBack, options) {
    window.history.replaceState(state, '', document.location.href)
    window.addEventListener("popstate", onGoBack)
    this.debug = options && options.debug
    this.logState('Router.start', state)
  },

  homepage(state) {
    const path = getPaginationPart(state.pageNumber)
    window.history.pushState(state, '', `${fetchPrefix}${path}`)
    this.logState('Router.homepage', state)
  },

  tag(state) {
    const paginationPart = getPaginationPart(state.pageNumber)
    window.history.pushState(state, '', `${fetchPrefix}/tags/${state.tag}${paginationPart}`)
    this.logState('Router.tag', state)
  },

  search(state) {
    window.history.pushState(state, '', `?search=${state.searchQuery}`)
    this.logState('Router.search', state)
  }
}
