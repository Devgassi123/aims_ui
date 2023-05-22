import {
    CREATE_DOC_NO_FORMAT,
    DELETE_DOC_NO_FORMAT,
    GET_DOC_NO_FORMAT,
    UPDATE_DOC_NO_FORMAT,
    SET_DOC_NO_FORMAT_DATA, 
    SET_DOC_NO_FORMAT_SELECTED_ROW,
    SET_SETTING_CURRENT_TAB
} from "../types/reduxtypes";

const intialState = {
    document: [],
    data: null,
    selectedRow: null,
    tab: 0
};

const docNoFormatReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_DOC_NO_FORMAT:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_DOC_NO_FORMAT:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_DOC_NO_FORMAT:
      return {
        ...state,
        document: state.document.map((x) =>
          x.docnoformat_id === action.payload.docnoformat_id
            ? action.payload
            : x
        ),
      };
    case DELETE_DOC_NO_FORMAT:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.docnoformat_id !== action.payload
        ),
      };
    case SET_DOC_NO_FORMAT_DATA:
        return {
            ...state,
            data: action.payload
        };
    case SET_DOC_NO_FORMAT_SELECTED_ROW:
        return {
            ...state,
            selectedRow: action.payload
        }
    case SET_SETTING_CURRENT_TAB:
        return {
            ...state,
            tab: action.payload
        };
    default:
      return state;
  }
};

export default docNoFormatReducer;
