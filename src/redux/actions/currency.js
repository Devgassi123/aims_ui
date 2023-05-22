import { currencyAPI } from "../api/api";
import {
  CREATE_CURRENCY,
  DELETE_CURRENCY,
  GET_CURRENCY,
  UPDATE_CURRENCY,
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

export const getCurrency = () => async (dispatch) => {
  try {
    const result = await currencyAPI().getAll();
    dispatch({
      type: GET_CURRENCY,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createCurrency = (data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    const res = await currencyAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, currency_id: lastInsertedId };
    dispatch({
      type: CREATE_CURRENCY,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateCurrency = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    await currencyAPI().update(id, data);
    dispatch({
      type: UPDATE_CURRENCY,
      payload: { currency_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteCurrency = (id, onSuccess) => async (dispatch) => {
  try {
    await currencyAPI().delete(id);
    dispatch({
      type: DELETE_CURRENCY,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
