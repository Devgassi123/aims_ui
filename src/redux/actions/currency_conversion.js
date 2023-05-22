import { currencyConversionAPI } from "../api/api";
import {
  CREATE_CURRENCY_CONVERSION,
  DELETE_CURRENCY_CONVERSION,
  GET_CURRENCY_CONVERSION,
  UPDATE_CURRENCY_CONVERSION,
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
    currency_id : parseInt(data.currency_id),
    exchange_rate: parseFloat(parseFloat(data.exchange_rate).toFixed(10)),
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getCurrencyConversions = () => async (dispatch) => {
  try {
    const result = await currencyConversionAPI().getAll();
    dispatch({
      type: GET_CURRENCY_CONVERSION,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const SetNewHomeCurrency = (id, data, onSuccess,updatedList) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
     await currencyConversionAPI(
      `/T_Currency_Conversion/SetNewHomeCurrency/`
    ).setNewHomeCurrency(id, data);

    dispatch({
      type: GET_CURRENCY_CONVERSION,
      payload: updatedList,
    });
    await currencyConversionAPI().update(id, data);
    dispatch({
      type: UPDATE_CURRENCY_CONVERSION,
      payload: { currency_conversion_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createCurrencyConversions = (data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    const res = await currencyConversionAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, currency_conversion_id: lastInsertedId };
    dispatch({
      type: CREATE_CURRENCY_CONVERSION,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateCurrencyConversions = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    await currencyConversionAPI().update(id, data);
    dispatch({
      type: UPDATE_CURRENCY_CONVERSION,
      payload: { currency_conversion_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteCurrencyConversions = (id, onSuccess) => async (dispatch) => {
  try {
    await currencyConversionAPI().delete(id);
    dispatch({
      type: DELETE_CURRENCY_CONVERSION,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
