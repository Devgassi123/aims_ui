import {
  CREATE_PIN,
  DELETE_PIN,
  GET_PIN,
  UPDATE_PIN,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const pinReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_PIN:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_PIN:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_PIN:
      return {
        ...state,
        document: state.document.map((x) =>
          x.pin_id === action.payload.pin_id ? action.payload : x
        ),
      };
    case DELETE_PIN:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.pin_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default pinReducer;
