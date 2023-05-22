import { locationAPI } from "../api/api";
import {
  CREATE_LOCATION,
  DELETE_LOCATION,
  GET_LOCATION,
  UPDATE_LOCATION,
    SET_LOCATION_DATA
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

export const getLocations = () => async (dispatch) => {
  try {
    const result = await locationAPI().getAll();
    dispatch({
      type: GET_LOCATION,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createLocations = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await locationAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, location_id: lastInsertedId };
    dispatch({
      type: CREATE_LOCATION,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateLocations = (id, data, onSuccess) => async (dispatch) => {
  try {
    await locationAPI().update(id, data);
    dispatch({
      type: UPDATE_LOCATION,
      payload: { location_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteLocations = (id, onSuccess) => async (dispatch) => {
  try {
    await locationAPI().delete(id);
    dispatch({
      type: DELETE_LOCATION,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const setLocationData = (payload) => {
    return{
        type: SET_LOCATION_DATA,
        payload: payload
    }
}
