import {
  CREATE_PRICE_ADJUSTMENT,
  DELETE_PRICE_ADJUSTMENT,
  GET_PRICE_ADJUSTMENT,
  UPDATE_PRICE_ADJUSTMENT,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const priceAdjustmentReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_PRICE_ADJUSTMENT:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_PRICE_ADJUSTMENT:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_PRICE_ADJUSTMENT:
      return {
        ...state,
        document: state.document.map((x) =>
          x.price_adjustment_id === action.payload.price_adjustment_id ? action.payload : x
        ),
      };
    case DELETE_PRICE_ADJUSTMENT:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.price_adjustment_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default priceAdjustmentReducer;
