import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORY,
  UPDATE_CATEGORY,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const categoryReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_CATEGORY:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_CATEGORY:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        document: state.document.map((x) =>
          x.category_id === action.payload.category_id ? action.payload : x
        ),
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.category_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default categoryReducer;
