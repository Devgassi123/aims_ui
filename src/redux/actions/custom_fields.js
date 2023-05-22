import { customFieldsAPI } from "../api/api";
import {
  CREATE_CUSTOM_FIELDS,
  DELETE_CUSTOM_FIELDS,
  GET_CUSTOM_FIELDS,
  UPDATE_CUSTOM_FIELDS,
} from "../types/reduxtypes";
import { standardDateTimeFormatter } from "../../Functions/Util";

/* Data corrector before dispatching */
const dataFormatter = (data) => {
  const standardDateTime = standardDateTimeFormatter(new Date());

  /* Session Data */
  const userSession_account_id = 1;
  const userSession_account_name = "admin";

  return {
    ...data,
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getCustomFields = () => async (dispatch) => {
  try {
    const result = await customFieldsAPI().getAll();
    dispatch({
      type: GET_CUSTOM_FIELDS,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createCustomFields = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await customFieldsAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, custom_fields_id: lastInsertedId };
    dispatch({
      type: CREATE_CUSTOM_FIELDS,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateCustomFields = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    await customFieldsAPI().update(id, data);
    dispatch({
      type: UPDATE_CUSTOM_FIELDS,
      payload: { custom_fields_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteCustomFields = (id, onSuccess) => async (dispatch) => {
  try {
    await customFieldsAPI().delete(id);
    dispatch({
      type: DELETE_CUSTOM_FIELDS,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
