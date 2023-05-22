import {
  CREATE_LOCATION,
  DELETE_LOCATION,
  GET_LOCATION,
  UPDATE_LOCATION,
    SET_LOCATION_DATA
} from "../types/reduxtypes";

const intialState = {
  document: [],
    data: null
};

const locationReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_LOCATION:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_LOCATION:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_LOCATION:
      return {
        ...state,
        document: state.document.map((x) =>
          x.location_id === action.payload.location_id ? action.payload : x
        ),
      };
    case DELETE_LOCATION:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.location_id !== action.payload
        ),
      };
    case SET_LOCATION_DATA:
        return {
            ...state,
            data: action.payload
        }
    default:
      return state;
  }
};

export default locationReducer;
