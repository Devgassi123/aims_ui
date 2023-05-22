import {
  CREATE_ADDRESS_TYPE_REF,
  DELETE_ADDRESS_TYPE_REF,
  GET_ADDRESS_TYPE_REF,
  UPDATE_ADDRESS_TYPE_REF,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};


const addressTypeRefReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_ADDRESS_TYPE_REF:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_ADDRESS_TYPE_REF:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_ADDRESS_TYPE_REF:
      return {
        ...state,
        document: state.document.map((x) =>
          x.address_type_id === action.payload.address_type_id ? action.payload : x
        ),
      };
    case DELETE_ADDRESS_TYPE_REF:
      return {
        ...state,
        document: state.document.filter((x) => x.address_type_id !== action.payload),
      };

    default:
      return state;
  }
};

export default addressTypeRefReducer;