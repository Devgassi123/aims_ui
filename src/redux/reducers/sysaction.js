  import {
    GET_SYSACTION,
    CREATE_SYSACTION,
    UPDATE_SYSACTION,
    DELETE_SYSACTION,
  } from "../types/reduxtypes";

   const intialState = {
     document: [],
   };

   const sysActionReducer = (state = intialState, action = {}) => {
     switch (action.type) {
       case GET_SYSACTION:
         return {
           ...state,
           document: [...action.payload],
         };
       case CREATE_SYSACTION:
         return {
           ...state,
           document: [...state.document, action.payload],
         };
       case UPDATE_SYSACTION:
         return {
           ...state,
           document: state.document.map((x) =>
             x.action_id === action.payload.action_id ? action.payload : x
           ),
         };
       case DELETE_SYSACTION:
         return {
           ...state,
           document: state.document.filter(
             (x) => x.action_id !== action.payload
           ),
         };

       default:
         return state;
     }
   };

   export default sysActionReducer;