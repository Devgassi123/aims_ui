import {
  CREATE_COMPANY_PREFRENCES,
  DELETE_COMPANY_PREFRENCES,
  GET_COMPANY_PREFRENCES,
  UPDATE_COMPANY_PREFRENCES,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const companyPreferencesReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_COMPANY_PREFRENCES:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_COMPANY_PREFRENCES:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_COMPANY_PREFRENCES:
      return {
        ...state,
        document: state.document.map((x) =>
          x.company_preferences_id === action.payload.company_preferences_id
            ? action.payload
            : x
        ),
      };
    case DELETE_COMPANY_PREFRENCES:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.company_preferences_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default companyPreferencesReducer;
