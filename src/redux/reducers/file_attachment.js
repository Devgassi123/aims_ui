import {
  CREATE_FILE_ATTACHMENT,
  DELETE_FILE_ATTACHMENT,
  GET_FILE_ATTACHMENT,
  UPDATE_FILE_ATTACHMENT,
  CLEAR_FILE_ATTACHMENT
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const fileAttachmentReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_FILE_ATTACHMENT:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_FILE_ATTACHMENT:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_FILE_ATTACHMENT:
      return {
        ...state,
        document: state.document.map((x) =>
          x.file_attachment_id === action.payload.file_attachment_id
            ? action.payload
            : x
        ),
      };
    case DELETE_FILE_ATTACHMENT:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.file_attachment_id !== action.payload
        ),
      };
    case CLEAR_FILE_ATTACHMENT:
      return {
        ...state,
        document: [],
      };
    default:
      return state;
  }
};

export default fileAttachmentReducer;
