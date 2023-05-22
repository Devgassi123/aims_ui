import {
  CREATE_READER_ANTENNA,
  DELETE_READER_ANTENNA,
  GET_READER_ANTENNA,
  UPDATE_READER_ANTENNA,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const readerAntennaReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_READER_ANTENNA:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_READER_ANTENNA:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_READER_ANTENNA:
      return {
        ...state,
        document: state.document.map((x) =>
          x.antenna_id === action.payload.antenna_id
            ? action.payload
            : x
        ),
      };
    case DELETE_READER_ANTENNA:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.antenna_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default readerAntennaReducer;