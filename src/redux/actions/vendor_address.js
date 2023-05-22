import { vendorAddressAPI } from "../api/api";
import {
  CREATE_VENDOR_ADDRESS,
  DELETE_VENDOR_ADDRESS,
  GET_VENDOR_ADDRESS,
  UPDATE_VENDOR_ADDRESS,
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
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getVendorAddress = () => async (dispatch) => {
  try {
    const result = await vendorAddressAPI().getAll();
    dispatch({
      type: GET_VENDOR_ADDRESS,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createVendorAddress = (
  data,
  onSuccess,
  getLatestVendorAddressId
) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await vendorAddressAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, vendor_address_id: lastInsertedId };
    getLatestVendorAddressId(lastInsertedId);
    dispatch({
      type: CREATE_VENDOR_ADDRESS,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateVendorAddress = (id, data, onSuccess) => async (dispatch) => {
  try {
    await vendorAddressAPI().update(id, data);
    dispatch({
      type: UPDATE_VENDOR_ADDRESS,
      payload: { vendor_address_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteVendorAddress = (id, onSuccess) => async (dispatch) => {
  try {
    await vendorAddressAPI().delete(id);
    dispatch({
      type: DELETE_VENDOR_ADDRESS,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
