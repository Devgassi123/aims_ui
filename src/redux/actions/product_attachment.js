import { productAttachmentAPI } from "../api/api";
import {
  CREATE_PRODUCT_ATTACHMENT,
  DELETE_PRODUCT_ATTACHMENT,
  GET_PRODUCT_ATTACHMENT,
  UPDATE_PRODUCT_ATTACHMENT,
} from "../types/reduxtypes";

/* Data corrector before dispatching */
const dataFormatter = (data) => {
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  /* Session Data */
  const userSession_account_id = 1;
  const userSession_account_name = "admin";

  return {
    ...data,
    last_mod_at: data.last_mod_at ? data.last_mod_at : utc,
    time_stamp: data.time_stamp ? data.time_stamp : utc,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getFileAttachment = () => async (dispatch) => {
  try {
    const result = await productAttachmentAPI().getAll();
    dispatch({
      type: GET_PRODUCT_ATTACHMENT,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createFileAttachment = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await productAttachmentAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, file_attachment_id: lastInsertedId };
    dispatch({
      type: CREATE_PRODUCT_ATTACHMENT,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateFileAttachment = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    await productAttachmentAPI().update(id, data);
    dispatch({
      type: UPDATE_PRODUCT_ATTACHMENT,
      payload: { file_attachment_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteFileAttachment = (id, onSuccess) => async (dispatch) => {
  try {
    await productAttachmentAPI().delete(id);
    dispatch({
      type: DELETE_PRODUCT_ATTACHMENT,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
