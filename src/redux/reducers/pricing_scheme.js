import {
  CREATE_PRICING_SCHEME,
  DELETE_PRICING_SCHEME,
  GET_PRICING_SCHEME,
  UPDATE_PRICING_SCHEME,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const pricingSchemeReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_PRICING_SCHEME:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_PRICING_SCHEME:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_PRICING_SCHEME:
      return {
        ...state,
        document: state.document.map((x) =>
          x.pricing_scheme_id === action.payload.pricing_scheme_id
            ? action.payload
            : x
        ),
      };
    case DELETE_PRICING_SCHEME:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.pricing_scheme_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default pricingSchemeReducer;
