import { salesRepRefAPI } from "../api/api";
import {
  CREATE_SALES_REP_REF,
  DELETE_SALES_REP_REF,
  GET_SALES_REP_REF,
  UPDATE_SALES_REP_REF,
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

export const getSalesRepRefs = () => async (dispatch) => {
  try {
    const result = await salesRepRefAPI().getAll();
    dispatch({
      type: GET_SALES_REP_REF,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createSalesRepRefs = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await salesRepRefAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, sales_rep_id: lastInsertedId };
    dispatch({
      type: CREATE_SALES_REP_REF,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateSalesRepRefs = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    await salesRepRefAPI().update(id, data);
    dispatch({
      type: UPDATE_SALES_REP_REF,
      payload: { sales_rep_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteSalesRepRefs = (id, onSuccess) => async (dispatch) => {
  try {
    await salesRepRefAPI().delete(id);
    dispatch({
      type: DELETE_SALES_REP_REF,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
