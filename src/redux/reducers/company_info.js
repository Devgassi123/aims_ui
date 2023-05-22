import {
  CREATE_COMPANY_INFO,
  DELETE_COMPANY_INFO,
  GET_COMPANY_INFO,
  UPDATE_COMPANY_INFO,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const companyInfoReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_COMPANY_INFO:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_COMPANY_INFO:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_COMPANY_INFO:
      return {
        ...state,
        document: state.document.map((x) =>
          x.company_id === action.payload.company_id ? action.payload : x
        ),
      };
    case DELETE_COMPANY_INFO:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.company_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default companyInfoReducer;