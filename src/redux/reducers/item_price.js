import {
  CREATE_ITEM_PRICE,
  DELETE_ITEM_PRICE,
  GET_ITEM_PRICE,
  UPDATE_ITEM_PRICE,
} from "../types/reduxtypes";

const intialState = {
  document: [],
};

const itemPriceReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_ITEM_PRICE:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_ITEM_PRICE:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_ITEM_PRICE:
      return {
        ...state,
        document: state.document.map((x) =>
          x.item_price_id === action.payload.item_price_id
            ? action.payload
            : x
        ),
      };
    case DELETE_ITEM_PRICE:
      return {
        ...state,
        document: state.document.filter(
          (x) => x.item_price_id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default itemPriceReducer;
