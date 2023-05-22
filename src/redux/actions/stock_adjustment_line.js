import { invStockAdjustmentLineAPI } from "../api/api";
import {
  CREATE_STOCK_ADJUSTMENT_LINE,
  DELETE_STOCK_ADJUSTMENT_LINE,
  GET_STOCK_ADJUSTMENT_LINE,
  UPDATE_STOCK_ADJUSTMENT_LINE,
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

export const getStockAdjustmentLine = () => async (dispatch) => {
  try {
    const result = await invStockAdjustmentLineAPI().getAll();
    dispatch({
      type: GET_STOCK_ADJUSTMENT_LINE,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createStockAdjustmentLine = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await invStockAdjustmentLineAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, stock_adjustment_line_id: lastInsertedId };
    dispatch({
      type: CREATE_STOCK_ADJUSTMENT_LINE,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateStockAdjustmentLine = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    await invStockAdjustmentLineAPI().update(id, data);
    dispatch({
      type: UPDATE_STOCK_ADJUSTMENT_LINE,
      payload: { stock_adjustment_line_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteStockAdjustmentLine = (id, onSuccess) => async (dispatch) => {
  try {
    await invStockAdjustmentLineAPI().delete(id);
    dispatch({
      type: DELETE_STOCK_ADJUSTMENT_LINE,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
