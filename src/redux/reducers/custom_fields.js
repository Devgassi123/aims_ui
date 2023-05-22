import {
  CREATE_CUSTOM_FIELDS,
  DELETE_CUSTOM_FIELDS,
  GET_CUSTOM_FIELDS,
  UPDATE_CUSTOM_FIELDS,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const customFieldsReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_CUSTOM_FIELDS:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_CUSTOM_FIELDS:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_CUSTOM_FIELDS:
      return {
        ...state,
        document: state.document.map((x) =>
          x.custom_fields_id === action.payload.custom_fields_id
            ? action.payload
            : x
        ),
      };
    case DELETE_CUSTOM_FIELDS:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.custom_fields_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default customFieldsReducer;
