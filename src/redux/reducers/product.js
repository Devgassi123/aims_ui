import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCT,
  UPDATE_PRODUCT,
  GET_PRODUCT_BY_ID
} from "../types/reduxtypes";

const intialState = {
  document: [],
  product_details: null
};

const productReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_PRODUCT:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_PRODUCT:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_PRODUCT:
      return {
        ...state,
        document: state.document.map((x) =>
          x.product_id === action.payload.product_id ? action.payload : x
        ),
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.product_id !== action.payload
        ),
      };
    case GET_PRODUCT_BY_ID:
      return {
        ...state,
        product_details: {...action.payload},
      };
    default:
      return state;
  }
};

export default productReducer;
