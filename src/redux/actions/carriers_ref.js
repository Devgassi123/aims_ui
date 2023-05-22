import { carriersRefAPI } from "../api/api";
import {
  CREATE_CARRIERS_REF,
  GET_CARRIERS_REF,
  DELETE_CARRIERS_REF,
  UPDATE_CARRIERS_REF,
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

export const getCarriersRefs = () => async (dispatch) => {
  try {
    const result = await carriersRefAPI().getAll();
    dispatch({
      type: GET_CARRIERS_REF,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createCarriersRefs = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await carriersRefAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, carrier_id: lastInsertedId };
    dispatch({
      type: CREATE_CARRIERS_REF,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateCarriersRefs = (id, data, onSuccess) => async (dispatch) => {
  try {
    await carriersRefAPI().update(id, data);
    dispatch({
      type: UPDATE_CARRIERS_REF,
      payload: { carrier_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteCarriersRefs = (id, onSuccess) => async (dispatch) => {
  try {
    await carriersRefAPI().delete(id);
    dispatch({
      type: DELETE_CARRIERS_REF,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
