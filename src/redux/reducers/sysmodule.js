  import {
    GET_SYSMODULE,
       CREATE_SYSMODULE,
       UPDATE_SYSMODULE,
       DELETE_SYSMODULE,
  } from "../types/reduxtypes";


  const intialState = {
    document: [],
  };

  const sysmoduleReducer = (state = intialState, action = {}) => {
    switch (action.type) {
      case GET_SYSMODULE:
        return {
          ...state,
          document: [...action.payload],
        };
      case CREATE_SYSMODULE:
        return {
          ...state,
          document: [...state.document, action.payload],
        };
      case UPDATE_SYSMODULE:
        return {
          ...state,
          document: state.document.map((x) =>
            x.module_id === action.payload.module_id ? action.payload : x
          ),
        };
      case DELETE_SYSMODULE:
        return {
          ...state,
          document: state.document.filter(
            (x) => x.module_id !== action.payload
          ),
        };

      default:
        return state;
    }
  };

  export default sysmoduleReducer;