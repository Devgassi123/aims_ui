import {
  GET_USERACC,
  CREATE_USERACC,
  UPDATE_USERACC,
  DELETE_USERACC,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const userAccReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_USERACC:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_USERACC:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_USERACC:
      return {
        ...state,
        document: state.document.map((x) =>
          x.account_id === action.payload.account_id ? action.payload : x
        ),
      };
    case DELETE_USERACC:
      return {
        ...state,
        document: state.document.filter((x) => x.account_id !== action.payload),
      };

    default:
      return state;
  }
};

export default userAccReducer;