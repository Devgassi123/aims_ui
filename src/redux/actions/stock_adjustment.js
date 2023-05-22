import { invStockAdjustmentAPI } from "../api/api";
import {
  CREATE_STOCK_ADJUSTMENT,
  DELETE_STOCK_ADJUSTMENT,
  GET_STOCK_ADJUSTMENT,
  UPDATE_STOCK_ADJUSTMENT,
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

export const getStockAdjustment = () => async (dispatch) => {
  try {
    const result = await invStockAdjustmentAPI().getAll();
    dispatch({
      type: GET_STOCK_ADJUSTMENT,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createStockAdjustment = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await invStockAdjustmentAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, stock_adjustment_id: lastInsertedId };
    dispatch({
      type: CREATE_STOCK_ADJUSTMENT,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateStockAdjustment = (id, data, onSuccess) => async (dispatch) => {
  try {
    await invStockAdjustmentAPI().update(id, data);
    dispatch({
      type: UPDATE_STOCK_ADJUSTMENT,
      payload: { stock_adjustment_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteStockAdjustment = (id, onSuccess) => async (dispatch) => {
  try {
    await invStockAdjustmentAPI().delete(id);
    dispatch({
      type: DELETE_STOCK_ADJUSTMENT,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
