import { standardDateTimeFormatter } from "../../Functions/Util";
import { priceAdjustmentLineAPI } from "../api/api";
import {
  CREATE_PRICE_ADJUSTMENT_LINE,
  DELETE_PRICE_ADJUSTMENT_LINE,
  GET_PRICE_ADJUSTMENT_LINE,
  UPDATE_PRICE_ADJUSTMENT_LINE,
} from "../types/reduxtypes";

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
    last_mod_at: data.last_mod_at ? data.last_mod_at : utc,
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getPriceAdjustmentLine = () => async (dispatch) => {
  try {
    const result = await priceAdjustmentLineAPI().getAll();
    dispatch({
      type: GET_PRICE_ADJUSTMENT_LINE,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createPriceAdjustmentLine = (data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    const res = await priceAdjustmentLineAPI(
      `/T_Dummy_Price_Adjustment_Line/BatchPriceAdjustmentProductLine/`
    ).create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, price_adjustment_line_id: lastInsertedId };
    dispatch({
      type: CREATE_PRICE_ADJUSTMENT_LINE,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updatePriceAdjustmentLine = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    await priceAdjustmentLineAPI().update(id, data);
    dispatch({
      type: UPDATE_PRICE_ADJUSTMENT_LINE,
      payload: { price_adjustment_line_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deletePriceAdjustmentLine = (id, onSuccess) => async (
  dispatch
) => {
  try {
    await priceAdjustmentLineAPI().delete(id);
    dispatch({
      type: DELETE_PRICE_ADJUSTMENT_LINE,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
