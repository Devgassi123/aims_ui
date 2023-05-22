import {
  CREATE_PRODUCT_ATTACHMENT,
  DELETE_PRODUCT_ATTACHMENT,
  GET_PRODUCT_ATTACHMENT,
  UPDATE_PRODUCT_ATTACHMENT,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const productAttachmentReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_PRODUCT_ATTACHMENT:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_PRODUCT_ATTACHMENT:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_PRODUCT_ATTACHMENT:
      return {
        ...state,
        document: state.document.map((x) =>
          x.product_attachment_id === action.payload.product_attachment_id
            ? action.payload
            : x
        ),
      };
    case DELETE_PRODUCT_ATTACHMENT:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.product_attachment_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default productAttachmentReducer;
