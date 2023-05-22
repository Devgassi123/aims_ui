import { fileAttachmentAPI } from "../api/api";
import {
  CREATE_FILE_ATTACHMENT,
  DELETE_FILE_ATTACHMENT,
  GET_FILE_ATTACHMENT,
  UPDATE_FILE_ATTACHMENT,
  CLEAR_FILE_ATTACHMENT
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
    last_mod_at: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
    file_location : data.url,
  };
};

export const getFileAttachment = (id = null, file_attachment_type= null) => async (dispatch) => {
  try {
    // const result = 
    //   id === null
    //     ? await fileAttachmentAPI().getAll()
    //     : await fileAttachmentAPI(`/T_File_Attachment/GetAttachmentByProduct`).getbyProduct(id, file_attachment_type);
    const result = id !== null && await fileAttachmentAPI(`/T_File_Attachment/GetAttachmentByProduct`).getbyProduct(id, file_attachment_type);
        
    const filteredList =
      result.data.document !== null &&
      result.data.document.map(
        ({
          product_id,
          file_name,
          file_location,
          file_attachment_type,
          file_attachment_id,
        }) => ({
          product_id,
          file_name,
          url: file_location,
          file_attachment_type,
          file_attachment_id,
        })
      );
    dispatch({
      type: GET_FILE_ATTACHMENT,
      payload: filteredList ? filteredList : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createFileAttachment = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await fileAttachmentAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, file_attachment_id: lastInsertedId };
    dispatch({
      type: CREATE_FILE_ATTACHMENT,
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
    await fileAttachmentAPI().update(id, data);
    dispatch({
      type: UPDATE_FILE_ATTACHMENT,
      payload: { file_attachment_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteFileAttachment = (id, onSuccess) => async (dispatch) => {
  try {
    await fileAttachmentAPI().delete(id);
    dispatch({
      type: DELETE_FILE_ATTACHMENT,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const clearFileAttachment = () => {
  return {
    type: CLEAR_FILE_ATTACHMENT
  }
}
