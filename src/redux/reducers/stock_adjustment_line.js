import {
  CREATE_STOCK_ADJUSTMENT_LINE,
  DELETE_STOCK_ADJUSTMENT_LINE,
  GET_STOCK_ADJUSTMENT_LINE,
  UPDATE_STOCK_ADJUSTMENT_LINE,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const stockAdjustmentLineReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_STOCK_ADJUSTMENT_LINE:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_STOCK_ADJUSTMENT_LINE:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_STOCK_ADJUSTMENT_LINE:
      return {
        ...state,
        document: state.document.map((x) =>
          x.stock_adjustment_line_id === action.payload.stock_adjustment_line_id
            ? action.payload
            : x
        ),
      };
    case DELETE_STOCK_ADJUSTMENT_LINE:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.stock_adjustment_line_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default stockAdjustmentLineReducer;
