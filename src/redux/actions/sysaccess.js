import { menuAPI } from "../api/api";
import {
  GET_SYSACCESS,
  CREATE_SYSACCESS,
  UPDATE_SYSACCESS,
  CREATE_MENU,
} from "../types/reduxtypes";


/* Session Data */
//   const userSession_account_id = 1;
//   const userSession_account_name = "admin";
  const userSession_role_id = 1;

export const getSysAccess = () => async (dispatch) => {
  try {
    const result = await menuAPI().getAll();
    dispatch({
      type: GET_SYSACCESS,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createSysAccess = (data) => async (dispatch) => {
  try {
    // console.log(data);
    const res = await menuAPI().create(data);
    /* first kapag role id is kapareho ng user's session role_id
    dispatch ka kay menu reducer para maupdate yung current menu ni gago */
    dispatch({
      type: CREATE_SYSACCESS,
      payload: res.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateSysAccess = (data) => async (dispatch) => {
  try {

    await menuAPI().update(data); //<---- Array
    const accessrights = data.find((x) => x);
    dispatch({
      type: UPDATE_SYSACCESS,
      payload: accessrights.role_id,
    });

     dispatch({
       type: CREATE_SYSACCESS,
       payload: data,
     });
    
     
    const role = data.find((x) => x);
    if (userSession_role_id === role.role_id) {
      dispatch({
        type: CREATE_MENU,
        payload: data,
      });
    }

  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteSysAccess = (data, onSuccess) => async (dispatch) => {
  try {
    await menuAPI().delete(data);
    // data.map((x) => {
    //   dispatch({
    //     type: DELETE_SYSACCESS,
    //     payload: x.id,
    //   });
    // });
    
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
