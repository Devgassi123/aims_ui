import { taxSchemeAPI } from "../api/api";
import {
  CREATE_TAX_SCHEME,
  DELETE_TAX_SCHEME,
  GET_TAX_SCHEME,
  UPDATE_TAX_SCHEME,
} from "../types/reduxtypes";
import { standardDateTimeFormatter } from "../../Functions/Util";

/* Data corrector before dispatching */
const dataFormatter = (data) => {
  const standardDateTime = standardDateTimeFormatter(new Date());

  /* Session Data */
  const userSession_account_id = 1;
  const userSession_account_name = "admin";
  const formatT_Tax_CodeModels = [
    ...data.t_Tax_CodeModels.map((x) => ({
      ...x,
      last_mod_at: standardDateTime,
      time_stamp: standardDateTime,
      last_mod_by_user_id: userSession_account_id,
    })),
  ];

  return {
    ...data,
    last_mod_at: standardDateTime,
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
    t_Tax_CodeModels: formatT_Tax_CodeModels,
  };
};

export const getTaxScheme = () => async (dispatch) => {
  try {
    const result = await taxSchemeAPI().getAll();
    dispatch({
      type: GET_TAX_SCHEME,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createTaxScheme = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await taxSchemeAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, taxing_scheme_id: lastInsertedId };
    dispatch({
      type: CREATE_TAX_SCHEME,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateTaxScheme = (id, data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    await taxSchemeAPI().update(id, data);
    dispatch({
      type: UPDATE_TAX_SCHEME,
      payload: { taxing_scheme_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteTaxScheme = (id, onSuccess) => async (dispatch) => {
  try {
    await taxSchemeAPI().delete(id);
    dispatch({
      type: DELETE_TAX_SCHEME,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
