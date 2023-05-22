import { categoryAPI } from "../api/api";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORY,
  UPDATE_CATEGORY,
} from "../types/reduxtypes";
import { standardDateTimeFormatter } from "../../Functions/Util";


/* Data corrector before dispatching */
const dataFormatter = (data) => {
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const standardDateTime = standardDateTimeFormatter(new Date());

  /* Session Data */
  const userSession_account_id = 1;
  const userSession_account_name = "admin";

  return {
    ...data,
    last_mod_at: data.last_mod_at ? data.last_mod_at : utc,
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getCategory = () => async (dispatch) => {
  try {
    const result = await categoryAPI().getAll();
    dispatch({
      type: GET_CATEGORY,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createCategory = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await categoryAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, category_id: lastInsertedId };
    dispatch({
      type: CREATE_CATEGORY,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateCategory = (id, data, onSuccess) => async (dispatch) => {
  try {
    await categoryAPI().update(id, data);
    dispatch({
      type: UPDATE_CATEGORY,
      payload: { category_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteCategory = (id, onSuccess) => async (dispatch) => {
  try {
    await categoryAPI().delete(id);
    dispatch({
      type: DELETE_CATEGORY,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
