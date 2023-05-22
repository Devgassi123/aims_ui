import {
  CREATE_RECEIVING_ADDRESS_REF,
  DELETE_RECEIVING_ADDRESS_REF,
  GET_RECEIVING_ADDRESS_REF,
  UPDATE_RECEIVING_ADDRESS_REF,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const receivingAddressRefReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_RECEIVING_ADDRESS_REF:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_RECEIVING_ADDRESS_REF:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_RECEIVING_ADDRESS_REF:
      return {
        ...state,
        document: state.document.map((x) =>
          x.receiving_address_id === action.payload.receiving_address_id ? action.payload : x
        ),
      };
    case DELETE_RECEIVING_ADDRESS_REF:
      return {
        ...state,
        document: state.document.filter((x) => x.receiving_address_id !== action.payload),
      };

    default:
      return state;
  }
};

export default receivingAddressRefReducer;
