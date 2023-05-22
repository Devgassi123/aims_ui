import {
  CREATE_CACHE_SUMMARY_COST,
  DELETE_CACHE_SUMMARY_COST,
  GET_CACHE_SUMMARY_COST,
  UPDATE_CACHE_SUMMARY_COST,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const priceAdjustmentReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_CACHE_SUMMARY_COST:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_CACHE_SUMMARY_COST:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_CACHE_SUMMARY_COST:
      return {
        ...state,
        document: state.document.map((x) =>
          x.product_id === action.payload.product_id
            ? action.payload
            : x
        ),
      };
    case DELETE_CACHE_SUMMARY_COST:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.product_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default priceAdjustmentReducer;
