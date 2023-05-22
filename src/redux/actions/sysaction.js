import {
  GET_SYSACTION,
  // CREATE_SYSACTION,
  // UPDATE_SYSACTION,
  // DELETE_SYSACTION,
} from "../types/reduxtypes";

 import { sysactionAPI } from "../api/api";

  export const getSysActions = () => async (dispatch) => {
    try {
      const result = await sysactionAPI().getAll();
      dispatch({
        type: GET_SYSACTION,
        payload: result.data.document,
      });
    } catch (err) {
      console.log("API Error", err);
    }
  };