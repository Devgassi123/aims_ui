import {
  CREATE_STOCK_ADJUSTMENT,
  DELETE_STOCK_ADJUSTMENT,
  GET_STOCK_ADJUSTMENT,
  UPDATE_STOCK_ADJUSTMENT,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const stockAdjustmentReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_STOCK_ADJUSTMENT:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_STOCK_ADJUSTMENT:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_STOCK_ADJUSTMENT:
      return {
        ...state,
        document: state.document.map((x) =>
          x.stock_adjustment_id === action.payload.stock_adjustment_id ? action.payload : x
        ),
      };
    case DELETE_STOCK_ADJUSTMENT:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.stock_adjustment_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default stockAdjustmentReducer;
