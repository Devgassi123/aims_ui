import {
  CREATE_CARRIERS_REF,
  DELETE_CARRIERS_REF,
  GET_CARRIERS_REF,
  UPDATE_CARRIERS_REF,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const carriersRefReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_CARRIERS_REF:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_CARRIERS_REF:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_CARRIERS_REF:
      return {
        ...state,
        document: state.document.map((x) =>
          x.carrier_id === action.payload.carrier_id ? action.payload : x
        ),
      };
    case DELETE_CARRIERS_REF:
      return {
        ...state,
        document: state.document.filter((x) => x.carrier_id !== action.payload),
      };

    default:
      return state;
  }
};

export default carriersRefReducer;
