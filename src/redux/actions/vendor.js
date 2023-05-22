import { vendorAPI } from "../api/api";
import {
  CREATE_VENDOR,
  DELETE_VENDOR,
  GET_VENDOR,
  UPDATE_VENDOR,
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
    last_mod_at: standardDateTime,
    time_stamp: standardDateTime,
    discount : parseFloat(data.discount).toFixed(2),
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getVendor = () => async (dispatch) => {
  try {
    const result = await vendorAPI().getAll();
    dispatch({
      type: GET_VENDOR,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createVendor = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await vendorAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, vendor_id: lastInsertedId };
    dispatch({
      type: CREATE_VENDOR,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateVendor = (id, data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    await vendorAPI().update(id, data);
    dispatch({
      type: UPDATE_VENDOR,
      payload: { vendor_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteVendor = (id, onSuccess) => async (dispatch) => {
  try {
    await vendorAPI().delete(id);
    dispatch({
      type: DELETE_VENDOR,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
