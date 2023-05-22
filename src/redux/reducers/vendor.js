import {
  CREATE_VENDOR,
  DELETE_VENDOR,
  GET_VENDOR,
  UPDATE_VENDOR,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const vendorReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_VENDOR:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_VENDOR:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_VENDOR:
      return {
        ...state,
        document: state.document.map((x) =>
          x.vendor_id === action.payload.vendor_id ? action.payload : x
        ),
      };
    case DELETE_VENDOR:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.vendor_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default vendorReducer;
