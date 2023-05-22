import {
  GET_SYSACCESS,
  CREATE_SYSACCESS,
  UPDATE_SYSACCESS,
  DELETE_SYSACCESS,
} from "../types/reduxtypes";


const intialState = {
  document: [],
};

const sysAccessReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_SYSACCESS:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_SYSACCESS:
      return {
        ...state,
        document: [...state.document, ...action.payload],
      };
    case UPDATE_SYSACCESS:
      return {
        ...state,
        document: state.document.filter((x) => x.role_id !== action.payload), //<--------Remove access
      };
    case DELETE_SYSACCESS:
      return {
        ...state,
        document: state.document.filter((x) => x.access_id !== action.payload),
      };

    default:
      return state;
  }
};

export default sysAccessReducer;