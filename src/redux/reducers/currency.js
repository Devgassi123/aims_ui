import {
  CREATE_CURRENCY,
  DELETE_CURRENCY,
  GET_CURRENCY,
  UPDATE_CURRENCY,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const currencyReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_CURRENCY:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_CURRENCY:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_CURRENCY:
      return {
        ...state,
        document: state.document.map((x) =>
          x.currency_id === action.payload.currency_id
            ? action.payload
            : x
        ),
      };
    case DELETE_CURRENCY:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.currency_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default currencyReducer;
