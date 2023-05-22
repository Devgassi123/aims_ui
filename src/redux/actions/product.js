import { productAPI } from "../api/api";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCT,
  UPDATE_PRODUCT,
  GET_PRODUCT_BY_ID
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

export const getProduct = () => async (dispatch) => {
  try {
    const result = await productAPI().getAll();
    dispatch({
      type: GET_PRODUCT,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createProduct = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await productAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, product_id: lastInsertedId };
    dispatch({
      type: CREATE_PRODUCT,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateProductCategory = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
     await productAPI(
      `/T_Product/UpdateProductCategory`
    ).updateCategory(data);
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateProduct = (id, data, onSuccess) => async (dispatch) => {
  try {
    await productAPI().update(id, data);
    dispatch({
      type: UPDATE_PRODUCT,
      payload: { product_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteProduct = (id, onSuccess) => async (dispatch) => {
  try {
    await productAPI().delete(id);
    dispatch({
      type: DELETE_PRODUCT,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const getProductById = (id) => async (dispatch) => {
  try {
    const result = await productAPI().getbyid(id);
    dispatch({
      type: GET_PRODUCT_BY_ID,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};
