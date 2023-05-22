import { userAccAPI } from "../api/api";
import {
  GET_USERACC,
  CREATE_USERACC,
  UPDATE_USERACC,
  DELETE_USERACC,
} from "../types/reduxtypes";

/* Data corrector before dispatching */
const dataFormatter = data =>{
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  /* Session Data */
  const userSession_account_id = 1;
  const userSession_account_name = "admin";

  return {
    account_name: data.account_name,
    account_email: data.account_email,
    account_password: data.account_password,
    role_id: data.role_id,
    created_at: data.created_at
      ? data.created_at
      : utc.toISOString().split("T")[0],
    updated_at: data.updated_at
      ? data.updated_at
      : utc.toISOString().split("T")[0],
    created_by: userSession_account_id,
    created_by_account_name: userSession_account_name,
  };
}

export const getUserAccounts = (role_id) => async (dispatch) => {
  try {
    const result = await userAccAPI().getAll(role_id);
    dispatch({
      type: GET_USERACC,
      payload: result.data.document ? result.data.document : [] ,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createUserAcc = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await userAccAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, account_id: lastInsertedId };
    dispatch({
      type: CREATE_USERACC,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateUserAcc = (id, data, onSuccess) => async (dispatch) => {
  try {
    await userAccAPI().update(id, data);
    dispatch({
      type: UPDATE_USERACC,
      payload: { account_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteUserAcc = (id, onSuccess) => async (dispatch) => {
  try {
    await userAccAPI().delete(id);
    dispatch({
      type: DELETE_USERACC,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
