import {
  CREATE_TAX_CODE,
  DELETE_TAX_CODE,
  GET_TAX_CODE,
  UPDATE_TAX_CODE,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const taxCodeReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_TAX_CODE:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_TAX_CODE:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_TAX_CODE:
      return {
        ...state,
        document: state.document.map((x) =>
          x.tax_code_id === action.payload.tax_code_id
            ? action.payload
            : x
        ),
      };
    case DELETE_TAX_CODE:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.tax_code_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default taxCodeReducer;
