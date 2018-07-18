import createReducer from '../lib/Reducer.js'
import {
  START_GET_LINKS,
  GET_LINKS,
  ERROR_GET_LINKS,
} from '../Constants.js'

const initialState = {
  isLoadingLinks: false,
  errorGetLinks: null,
  activePage: 1,
  links: []
}

const LinksReducer = (state, { type, payload }) => {
  switch (type) {
    case START_GET_LINKS:
      return {
        isLoadingLinks: true,
        errorGetLinks: null
      }

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

    default:
      return state
  }
}

export default createReducer(initialState, LinksReducer)
