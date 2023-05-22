import {
  CREATE_UNITS_REF,
  DELETE_UNITS_REF,
  GET_UNITS_REF,
  UPDATE_UNITS_REF,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const unitsRefReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_UNITS_REF:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_UNITS_REF:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_UNITS_REF:
      return {
        ...state,
        document: state.document.map((x) =>
          x.uom_id === action.payload.uom_id
            ? action.payload
            : x
        ),
      };
    case DELETE_UNITS_REF:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.uom_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default unitsRefReducer;
