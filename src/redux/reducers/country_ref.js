import {
  CREATE_COUNTRY_REF,
  DELETE_COUNTRY_REF,
  GET_COUNTRY_REF,
  UPDATE_COUNTRY_REF,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const countryRefReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_COUNTRY_REF:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_COUNTRY_REF:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_COUNTRY_REF:
      return {
        ...state,
        document: state.document.map((x) =>
          x.id === action.payload.id ? action.payload : x
        ),
      };
    case DELETE_COUNTRY_REF:
      return {
        ...state,
        document: state.document.filter((x) => x.id !== action.payload),
      };

    default:
      return state;
  }
};

export default countryRefReducer;
