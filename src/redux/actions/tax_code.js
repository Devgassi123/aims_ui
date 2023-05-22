import { taxCodeAPI } from "../api/api";
import {
  CREATE_TAX_CODE,
  DELETE_TAX_CODE,
  GET_TAX_CODE,
  UPDATE_TAX_CODE,
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
    tax1_rate: parseFloat(data.tax1_rate),
    tax2_rate: parseFloat(data.tax2_rate),
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getTaxCode = () => async (dispatch) => {
  try {
    const result = await taxCodeAPI().getAll();
    dispatch({
      type: GET_TAX_CODE,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const getInitialTaxCode = (intialTaxCodeList) => async (dispatch) => {
  try {
    dispatch({
      type: GET_TAX_CODE,
      payload: intialTaxCodeList,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createTaxCode = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    dispatch({
      type: CREATE_TAX_CODE,
      payload: data,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateTaxCode = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    dispatch({
      type: UPDATE_TAX_CODE,
      payload: { tax_code_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteTaxCode = (id, onSuccess) => async (dispatch) => {
  try {
    await taxCodeAPI().delete(id);
    dispatch({
      type: DELETE_TAX_CODE,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
