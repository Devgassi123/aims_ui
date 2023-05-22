// import {
//   distinctModuleArray,
//   modifiedModuleDesc,
//   parentChildConverter,
// } from "../../Functions/Util";
import { 
  // menuAPI,
  userAccAPI 
} from "../api/api";
import { CREATE_MENU, GET_MENU } from "../types/reduxtypes";

/* Session Data */
// const userSession_role_id = 1;

export const getUserMenu = () => async (dispatch) => {
  try {
    // const result = await menuAPI().getAll();

    const result = await userAccAPI().login()

    dispatch({
      type: GET_MENU,
      // payload: result.data.data.filter(module => module.envTypeId === "WEB")
      payload: result.data.data.webUserAccessRights,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createMenu = (data) => async (dispatch) => {
  try {
    dispatch({
      type: CREATE_MENU,
      payload: data,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};
