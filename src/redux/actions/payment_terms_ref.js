import { paymentTermsRefAPI } from "../api/api";
import {
  CREATE_PAYMENT_TERMS_REF,
  DELETE_PAYMENT_TERMS_REF,
  GET_PAYMENT_TERMS_REF,
  UPDATE_PAYMENT_TERMS_REF,
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
    days_due: parseInt(data.days_due),
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getPaymentTermsRefs = () => async (dispatch) => {
  try {
    const result = await paymentTermsRefAPI().getAll();
    dispatch({
      type: GET_PAYMENT_TERMS_REF,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createPaymentTermsRefs = (data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    const res = await paymentTermsRefAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, payment_terms_id: lastInsertedId };
    dispatch({
      type: CREATE_PAYMENT_TERMS_REF,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updatePaymentTermsRefs = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    await paymentTermsRefAPI().update(id, data);
    dispatch({
      type: UPDATE_PAYMENT_TERMS_REF,
      payload: { payment_terms_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deletePaymentTermsRefs = (id, onSuccess) => async (dispatch) => {
  try {
    await paymentTermsRefAPI().delete(id);
    dispatch({
      type: DELETE_PAYMENT_TERMS_REF,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
