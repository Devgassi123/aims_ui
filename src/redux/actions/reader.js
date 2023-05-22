import { readerAPI } from "../api/api";
import {
  CREATE_READER,
  DELETE_READER,
  GET_READER,
  UPDATE_READER,
} from "../types/reduxtypes";

/* Data corrector before dispatching */
const dataFormatter = (data) => {
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  /* Session Data */
  const userSession_account_id = 1;
  // const userSession_account_name = "admin";

  return {
    ...data,
    created_at: data.last_mod_at ? data.last_mod_at : utc,
    antenna: parseInt(data.antenna),
    map_image_id: parseInt(data.antenna),
    latitude: parseFloat(parseFloat(data.latitude).toFixed(8)),
    longitude: parseFloat(parseFloat(data.longitude).toFixed(8)),
    // time_stamp: data.time_stamp ? data.time_stamp : utc,
    created_by: userSession_account_id,
    // last_mod_by_user: userSession_account_name,
  };
};

export const getReaders = () => async (dispatch) => {
  try {
    const result = await readerAPI().getAll();
    dispatch({
      type: GET_READER,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createReaders = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await readerAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, location_id: lastInsertedId };
    dispatch({
      type: CREATE_READER,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateReaders = (id, data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    await readerAPI().update(id, data);
    dispatch({
      type: UPDATE_READER,
      payload: { location_reader_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteReaders = (id, onSuccess) => async (dispatch) => {
  try {
    await readerAPI().delete(id);
    dispatch({
      type: DELETE_READER,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
