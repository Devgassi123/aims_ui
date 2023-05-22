 import { sysmoduleAPI } from "../api/api";
 import {
   GET_SYSMODULE,
//    CREATE_SYSMODULE,
//    UPDATE_SYSMODULE,
//    DELETE_SYSMODULE,
 } from "../types/reduxtypes";


 export const getSysModules = () => async (dispatch) => {
   try {
     const result = await sysmoduleAPI().getAll();
     dispatch({
       type: GET_SYSMODULE,
       payload: result.data.document,
     });
   } catch (err) {
     console.log("API Error", err);
   }
 };