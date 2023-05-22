import {
  CREATE_PAYMENT_METHOD_REF,
  DELETE_PAYMENT_METHOD_REF,
  GET_PAYMENT_METHOD_REF,
  UPDATE_PAYMENT_METHOD_REF,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const paymentMethodRefReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_PAYMENT_METHOD_REF:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_PAYMENT_METHOD_REF:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_PAYMENT_METHOD_REF:
      return {
        ...state,
        document: state.document.map((x) =>
          x.payment_method_id === action.payload.payment_method_id ? action.payload : x
        ),
      };
    case DELETE_PAYMENT_METHOD_REF:
      return {
        ...state,
        document: state.document.filter((x) => x.payment_method_id !== action.payload),
      };

    default:
      return state;
  }
};

export default paymentMethodRefReducer;
