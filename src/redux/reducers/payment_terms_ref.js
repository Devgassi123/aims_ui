import {
  CREATE_PAYMENT_TERMS_REF,
  DELETE_PAYMENT_TERMS_REF,
  GET_PAYMENT_TERMS_REF,
  UPDATE_PAYMENT_TERMS_REF,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const paymentTermsRefReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_PAYMENT_TERMS_REF:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_PAYMENT_TERMS_REF:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_PAYMENT_TERMS_REF:
      return {
        ...state,
        document: state.document.map((x) =>
          x.payment_terms_id === action.payload.payment_terms_id
            ? action.payload
            : x
        ),
      };
    case DELETE_PAYMENT_TERMS_REF:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.payment_terms_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default paymentTermsRefReducer;
