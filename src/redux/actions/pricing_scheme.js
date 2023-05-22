import { pricingSchemeAPI } from "../api/api";
import {
  CREATE_PRICING_SCHEME,
  DELETE_PRICING_SCHEME,
  GET_PRICING_SCHEME,
  UPDATE_PRICING_SCHEME,
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
    currency_id: parseInt(data.currency_id),
    last_mod_at: standardDateTime,
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getPricingSchemes = () => async (dispatch) => {
  try {
    const result = await pricingSchemeAPI().getAll();
    dispatch({
      type: GET_PRICING_SCHEME,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createPricingSchemes = (data, onSuccess, updatedList) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    const res = await pricingSchemeAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, pricing_scheme_id: lastInsertedId };
    dispatch({
      type: CREATE_PRICING_SCHEME,
      payload: updatedData,
    });
    onSuccess();

    //update the pricing scheme list if is_active == true
    if (data.is_active) {
      dispatch({
        type: GET_PRICING_SCHEME,
        payload: updatedList,
      });
    }
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updatePricingSchemes = (id, data, onSuccess, updatedList) => async (
  dispatch
) => {
  try {
    await pricingSchemeAPI().update(id, data);
    dispatch({
      type: UPDATE_PRICING_SCHEME,
      payload: { pricing_scheme_id: id, ...data },
    });
    onSuccess();

    //update the pricing scheme list if is_active == true
    if(data.is_active){
      dispatch({
        type: GET_PRICING_SCHEME,
        payload: updatedList,
      });
    }

  } catch (err) {
    console.log("API Error", err);
  }
};

export const deletePricingSchemes = (id, onSuccess) => async (dispatch) => {
  try {
    await pricingSchemeAPI().delete(id);
    dispatch({
      type: DELETE_PRICING_SCHEME,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
