import {
  CREATE_CURRENCY_CONVERSION,
  DELETE_CURRENCY_CONVERSION,
  GET_CURRENCY_CONVERSION,
  UPDATE_CURRENCY_CONVERSION,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const currencyConversionReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_CURRENCY_CONVERSION:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_CURRENCY_CONVERSION:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_CURRENCY_CONVERSION:
      return {
        ...state,
        document: state.document.map((x) =>
          x.currency_conversion_id === action.payload.currency_conversion_id
            ? action.payload
            : x
        ),
      };
    case DELETE_CURRENCY_CONVERSION:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.currency_conversion_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default currencyConversionReducer;
