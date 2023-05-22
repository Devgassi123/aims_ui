import {
  CREATE_SALES_REP_REF,
  DELETE_SALES_REP_REF,
  GET_SALES_REP_REF,
  UPDATE_SALES_REP_REF,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const salesRepRefReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_SALES_REP_REF:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_SALES_REP_REF:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_SALES_REP_REF:
      return {
        ...state,
        document: state.document.map((x) =>
          x.sales_rep_id === action.payload.sales_rep_id
            ? action.payload
            : x
        ),
      };
    case DELETE_SALES_REP_REF:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.sales_rep_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default salesRepRefReducer;
