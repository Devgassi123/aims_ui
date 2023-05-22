import { docNoFormatAPI } from "../api/api";
import {
    CREATE_DOC_NO_FORMAT,
    GET_DOC_NO_FORMAT,
    DELETE_DOC_NO_FORMAT,
    UPDATE_DOC_NO_FORMAT,
    SET_DOC_NO_FORMAT_DATA, 
    SET_DOC_NO_FORMAT_SELECTED_ROW,
    SET_SETTING_CURRENT_TAB
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
    next_number : parseInt(data.next_number),
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getDocNoFormats = () => async (dispatch) => {
  try {
    const result = await docNoFormatAPI().getAll();
    dispatch({
      type: GET_DOC_NO_FORMAT,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createDocNoFormats = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await docNoFormatAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, docnoformat_id: lastInsertedId };
    dispatch({
      type: CREATE_DOC_NO_FORMAT,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateDocNoFormats = (id, data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    await docNoFormatAPI().update(id, data);
    dispatch({
      type: UPDATE_DOC_NO_FORMAT,
      payload: { docnoformat_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteDocNoFormats = (id, onSuccess) => async (dispatch) => {
  try {
    await docNoFormatAPI().delete(id);
    dispatch({
      type: DELETE_DOC_NO_FORMAT,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const setDocNoFormatData = (payload) => {
    return {
        type: SET_DOC_NO_FORMAT_DATA,
        payload: payload,
    };
}

export const setDocNoFormatSelectedRow = (rowData) => (dispatch) => {
    dispatch({
        type: SET_DOC_NO_FORMAT_SELECTED_ROW,
        payload: rowData,
    });
}

export const setBaseSettingCurrentTab = (tabIndex) => (dispatch) => {
    dispatch({
        type: SET_SETTING_CURRENT_TAB,
        payload: tabIndex,
    });
}