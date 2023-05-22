import { GET_ROLES,CREATE_ROLES,UPDATE_ROLES,DELETE_ROLES } from "../types/reduxtypes";


const intialState = {
  document: [],
};

const roleReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_ROLES:
      return {
        ...state,
        document: [...action.payload],
      };
    case CREATE_ROLES:
      return {
        ...state,
        document: [...state.document, action.payload],
      };
    case UPDATE_ROLES:
      return {
        ...state,
        document: state.document.map((x) =>
          x.role_id === action.payload.role_id ? action.payload : x
        ),
      };
    case DELETE_ROLES:
      return {
        ...state,
        document: state.document.filter(x=>x.role_id !== action.payload),
      };

    default:
      return state;
  }
};

export default roleReducer;
