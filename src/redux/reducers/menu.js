import { GET_MENU, CREATE_MENU } from "../types/reduxtypes";

const intialState = {
  data: [],
};

const menuReducer = (state = intialState, action = {}) => {
  switch (action.type) {
    case GET_MENU:
      return {
        ...state,
        data: [...action.payload].sort((a, b) => a.seqNum - b.seqNum),
      };
    case CREATE_MENU:
      return {
        ...state,
        data: [...action.payload].sort((a, b) => a.moduleId - b.moduleId),
      };
      
    default:
      return state;
  }
};

export default menuReducer;
