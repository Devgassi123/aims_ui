import {
  CREATE_TAX_SCHEME,
  DELETE_TAX_SCHEME,
  GET_TAX_SCHEME,
  UPDATE_TAX_SCHEME,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const taxSchemeReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_TAX_SCHEME:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_TAX_SCHEME:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_TAX_SCHEME:
      return {
        ...state,
        document: state.document.map((x) =>
          x.taxing_scheme_id === action.payload.taxing_scheme_id
            ? action.payload
            : x
        ),
      };
    case DELETE_TAX_SCHEME:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.taxing_scheme_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default taxSchemeReducer;
