import { paymentMethodRefAPI } from "../api/api";
import {
    CREATE_PAYMENT_METHOD_REF,

    DELETE_PAYMENT_METHOD_REF, GET_PAYMENT_METHOD_REF,

    UPDATE_PAYMENT_METHOD_REF
} from "../types/reduxtypes";

/* Data corrector before dispatching */
const dataFormatter = (data) => {
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  /* Session Data */
  const userSession_account_id = 1;
  const userSession_account_name = "admin";

  return {
    ...data,
    last_mod_at: data.last_mod_at ? data.last_mod_at : utc,
    time_stamp: data.time_stamp ? data.time_stamp : utc,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getPaymentMethodRefs = () => async (dispatch) => {
  try {
    const result = await paymentMethodRefAPI().getAll();
    dispatch({
      type: GET_PAYMENT_METHOD_REF,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createPaymentMethodRefs = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await paymentMethodRefAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, payment_method_id: lastInsertedId };
    dispatch({
      type: CREATE_PAYMENT_METHOD_REF,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updatePaymentMethodRefs = (id, data, onSuccess) => async (dispatch) => {
  try {
    await paymentMethodRefAPI().update(id, data);
    dispatch({
      type: UPDATE_PAYMENT_METHOD_REF,
      payload: { payment_method_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deletePaymentMethodRefs = (id, onSuccess) => async (dispatch) => {
  try {
    await paymentMethodRefAPI().delete(id);
    dispatch({
      type: DELETE_PAYMENT_METHOD_REF,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
