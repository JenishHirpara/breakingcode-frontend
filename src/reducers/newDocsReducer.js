import { FETCH_ALL_DOCS, CREATE_NEW_DOC, FILTER_DOCS, CLEAR_DOCS } from "../actions/types";

const initialState = {
  docs: null,
  filtered: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_DOCS:
      return {
        ...state,
        docs: action.payload,
      };
    case CREATE_NEW_DOC:
      return state;
    case FILTER_DOCS:
      return {
        ...state,
        filtered: state.docs.filter(doc => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return doc.title.match(regex);
        })
      }
    case CLEAR_DOCS:
      return {
        ...state,
        filtered: null
      }
    default:
      return state;
  }
};

export default reducer;
