import { priceAdjustmentAPI } from "../api/api";
import {
  CREATE_PRICE_ADJUSTMENT,
  DELETE_PRICE_ADJUSTMENT,
  GET_PRICE_ADJUSTMENT,
  UPDATE_PRICE_ADJUSTMENT,
} from "../types/reduxtypes";
import { standardDateTimeFormatter } from "../../Functions/Util";

/* Data corrector before dispatching */
const dataFormatter = (data) => {
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const standardDateTime = standardDateTimeFormatter(new Date());

  /* Session Data */
  const userSession_account_id = 1;
  const userSession_account_name = "admin";

  return {
    ...data,
    amount: parseFloat(data.amount),
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getPriceAdjustment = () => async (dispatch) => {
  try {
    const result = await priceAdjustmentAPI().getAll();
    dispatch({
      type: GET_PRICE_ADJUSTMENT,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createPriceAdjustment = (data, onSuccess) => async (dispatch) => {
  try {
    
    data = dataFormatter(data);
    const res = await priceAdjustmentAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, price_adjustment_id: lastInsertedId };
    dispatch({
      type: CREATE_PRICE_ADJUSTMENT,
      payload: updatedData,
    });
    onSuccess(lastInsertedId);
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updatePriceAdjustment = (id, data, onSuccess) => async (dispatch) => {
  try {
    await priceAdjustmentAPI().update(id, data);
    dispatch({
      type: UPDATE_PRICE_ADJUSTMENT,
      payload: { price_adjustment_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deletePriceAdjustment = (id, onSuccess) => async (dispatch) => {
  try {
    await priceAdjustmentAPI().delete(id);
    dispatch({
      type: DELETE_PRICE_ADJUSTMENT,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
