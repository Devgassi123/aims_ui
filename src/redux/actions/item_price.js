import { standardDateTimeFormatter } from "../../Functions/Util";
import { itemPriceAPI } from "../api/api";
import {
  CREATE_ITEM_PRICE,
  DELETE_ITEM_PRICE,
  GET_ITEM_PRICE,
  UPDATE_ITEM_PRICE,
} from "../types/reduxtypes";

/* Data corrector before dispatching */
const dataFormatter = (data) => {
 
  const standardDateTime = standardDateTimeFormatter(new Date());

  /* Session Data */
  const userSession_account_id = 1;
  const userSession_account_name = "admin";

  return {
    ...data,
    time_stamp: standardDateTime,
    last_mod_at: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getItemPrice = () => async (dispatch) => {
  try {
    const result = await itemPriceAPI().getAll();
    dispatch({
      type: GET_ITEM_PRICE,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};



export const getItemPriceByProduct = (columnName,data) => async (dispatch) => {
  try {
    const result = await itemPriceAPI(
      `/T_Item_Price/GetAllItemPriceByProduct`
    ).getAllItemPriceByProduct(data);
     const filteredList = result.data.document.map(
       ({
         product_id,
         name,
         description,
         unit_price,
         summary_cost,
         base_price,
         new_price,
         pricing_scheme_id,
         pricing_scheme_name,
       }) => ({
         product_id,
         name,
         description,
         old_price: unit_price,
         cost : summary_cost,
         [columnName] : base_price,
         new_price: 0,
         pricing_scheme_id,
         pricing_scheme_name,
       })
     );
    dispatch({
      type: GET_ITEM_PRICE,
      payload: filteredList,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const setItemPrice = (data) => async (dispatch) => {
  try {
    dispatch({
      type: GET_ITEM_PRICE,
      payload: data,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createItemPrice = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await itemPriceAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, item_price_id: lastInsertedId };
    dispatch({
      type: CREATE_ITEM_PRICE,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateItemPrice = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    await itemPriceAPI().update(id, data);
    dispatch({
      type: UPDATE_ITEM_PRICE,
      payload: { item_price_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const batchUpdateItemPrice = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    await itemPriceAPI(
      `/T_Item_Price/BatchUpdateItemPrice`
    ).batchUpdateItemPrice(data);
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteItemPrice = (id, onSuccess) => async (dispatch) => {
  try {
    await itemPriceAPI().delete(id);
    dispatch({
      type: DELETE_ITEM_PRICE,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
