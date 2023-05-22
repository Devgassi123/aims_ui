import {
  CREATE_READER,
  DELETE_READER,
  GET_READER,
  UPDATE_READER,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const readerReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_READER:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_READER:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_READER:
      return {
        ...state,
        document: state.document.map((x) =>
          x.location_reader_id === action.payload.location_reader_id ? action.payload : x
        ),
      };
    case DELETE_READER:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.location_reader_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default readerReducer;