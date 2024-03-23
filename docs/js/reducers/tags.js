import createReducer from '../lib/Reducer.js'
import {
  GET_TAGS,
  ERROR_GET_TAGS,
} from '../Constants.js'

const initialState = {
  tags: []
}

const TagsReducer = (state, { type, payload }) => {
  switch (type) {
    case GET_TAGS:
      return {
        errorGetTags: null,
        tags: payload.tags
      }

    case ERROR_GET_TAGS:
      return {
        errorGetLinks: payload.error
      }

    default:
      return state
  }
}

export default createReducer(initialState, TagsReducer)
