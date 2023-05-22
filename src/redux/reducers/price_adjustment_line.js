import {
  CREATE_PRICE_ADJUSTMENT_LINE,
  DELETE_PRICE_ADJUSTMENT_LINE,
  GET_PRICE_ADJUSTMENT_LINE,
  UPDATE_PRICE_ADJUSTMENT_LINE,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const priceAdjustmentLineReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_PRICE_ADJUSTMENT_LINE:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_PRICE_ADJUSTMENT_LINE:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_PRICE_ADJUSTMENT_LINE:
      return {
        ...state,
        document: state.document.map((x) =>
          x.price_adjustment_line_id === action.payload.price_adjustment_line_id
            ? action.payload
            : x
        ),
      };
    case DELETE_PRICE_ADJUSTMENT_LINE:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.price_adjustment_line_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default priceAdjustmentLineReducer;
