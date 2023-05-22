import {
  CREATE_COSTING_METHOD,
  DELETE_COSTING_METHOD,
  GET_COSTING_METHOD,
  UPDATE_COSTING_METHOD,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const costingMethodReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_COSTING_METHOD:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_COSTING_METHOD:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_COSTING_METHOD:
      return {
        ...state,
        document: state.document.map((x) =>
          x.costing_method_id === action.payload.costing_method_id
            ? action.payload
            : x
        ),
      };
    case DELETE_COSTING_METHOD:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.costing_method_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default costingMethodReducer;
