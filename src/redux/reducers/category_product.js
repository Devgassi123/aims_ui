import {
  CREATE_CATEGORY_PRODUCT,
  DELETE_CATEGORY_PRODUCT,
  GET_CATEGORY_PRODUCT,
  UPDATE_CATEGORY_PRODUCT,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const categoryProductReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_CATEGORY_PRODUCT:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_CATEGORY_PRODUCT:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_CATEGORY_PRODUCT:
      return {
        ...state,
        document: state.document.map((x) =>
          x.product_id === action.payload.product_id ? action.payload : x
        ),
      };
    case DELETE_CATEGORY_PRODUCT:
      return {
        ...state,
        document: state.document.filter((x) => x.product_id !== action.payload),
      };

    default:
      return state;
  }
};

export default categoryProductReducer;
