import { itemCacheSummaryCostAPI } from "../api/api";
import {
  CREATE_CACHE_SUMMARY_COST,
  DELETE_CACHE_SUMMARY_COST,
  GET_CACHE_SUMMARY_COST,
  UPDATE_CACHE_SUMMARY_COST,
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
    last_mod_at: data.last_mod_at ? data.last_mod_at : utc,
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getCacheSummaryCost = () => async (dispatch) => {
  try {
    const result = await itemCacheSummaryCostAPI().getAll();
    dispatch({
      type: GET_CACHE_SUMMARY_COST,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const getCacheSummaryCostByProd = (id) => async () => {
  
  try {
    const result = await itemCacheSummaryCostAPI().getbyid(id);
    return result.data.document;
  } catch (err) {
    console.log("API Error", err);
    return null;
  }
};

export const createCacheSummaryCost = (data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    const res = await itemCacheSummaryCostAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, product_id: lastInsertedId };
    dispatch({
      type: CREATE_CACHE_SUMMARY_COST,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateCacheSummaryCost = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    await itemCacheSummaryCostAPI().update(id, data);
    dispatch({
      type: UPDATE_CACHE_SUMMARY_COST,
      payload: { product_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteCacheSummaryCost = (id, onSuccess) => async (
  dispatch
) => {
  try {
    await itemCacheSummaryCostAPI().delete(id);
    dispatch({
      type: DELETE_CACHE_SUMMARY_COST,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
