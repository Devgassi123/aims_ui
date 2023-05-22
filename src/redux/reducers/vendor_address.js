import {
  CREATE_VENDOR_ADDRESS,
  DELETE_VENDOR_ADDRESS,
  GET_VENDOR_ADDRESS,
  UPDATE_VENDOR_ADDRESS,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const vendorAddressReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_VENDOR_ADDRESS:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_VENDOR_ADDRESS:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_VENDOR_ADDRESS:
      return {
        ...state,
        document: state.document.map((x) =>
          x.vendor_address_id === action.payload.vendor_address_id ? action.payload : x
        ),
      };
    case DELETE_VENDOR_ADDRESS:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.vendor_address_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default vendorAddressReducer;
