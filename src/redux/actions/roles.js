import { roleAPI } from "../api/api";
import {
  GET_ROLES,
  CREATE_ROLES,
  UPDATE_ROLES,
  DELETE_ROLES,
} from "../types/reduxtypes";
 
/* Data corrector before dispatching */
const dataFormatter = data =>{
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  /* Session Data */
  const userSession_account_id = 1;
  const userSession_account_name = "admin";

  return {
    ...data,
    created_at: data.created_at ? data.created_at : utc,
    updated_at: data.updated_at ? data.updated_at : utc,
    created_by: userSession_account_id,
    created_by_account_name: userSession_account_name,
  };
}

export const getRoles = () => async (dispatch) => {
  try {
    const result = await roleAPI().getAll();
    dispatch({
      type: GET_ROLES,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};


export const createRoles = (data, onSuccess, createAccessRights) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    const res = await roleAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, role_id: lastInsertedId };
    dispatch({
      type: CREATE_ROLES,
      payload: updatedData,
    });
    onSuccess();
    createAccessRights(lastInsertedId);
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateRoles = (id,data, onSuccess) => async (dispatch) => {
  try {
     await roleAPI().update(id,data);
    dispatch({
      type: UPDATE_ROLES,
      payload: {role_id:id, ...data},
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteRoles = (id, onSuccess) => async (dispatch) => {
  try {
    await roleAPI().delete(id);
    dispatch({
      type: DELETE_ROLES,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};