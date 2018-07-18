import createReducer from '../lib/Reducer.js'
import {
  GET_LINKS,
  ERROR_GET_LINKS,
} from '../Constants.js'

const initialState = {
  errorGetLinks: null,
  activePage: 1,
  links: []
}

const LinksReducer = (state, { type, payload }) => {
  switch (type) {
    case GET_LINKS:
      return {
        errorGetLinks: null,
        activePage: payload.page,
        links: payload.links
      }

    case ERROR_GET_LINKS:
      return {
        errorGetLinks: payload.error
      }

    default:
      return state
  }
}

export default createReducer(initialState, LinksReducer)
