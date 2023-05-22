import { unitsRefAPI } from "../api/api";
import {
  CREATE_UNITS_REF,
  DELETE_UNITS_REF,
  GET_UNITS_REF,
  UPDATE_UNITS_REF,
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

export const getUnitsRefs = () => async (dispatch) => {
  try {
    const result = await unitsRefAPI().getAll();
    dispatch({
      type: GET_UNITS_REF,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createUnitsRefs = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await unitsRefAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, uom_id: lastInsertedId };
    dispatch({
      type: CREATE_UNITS_REF,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateUnitsRefs = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    await unitsRefAPI().update(id, data);
    dispatch({
      type: UPDATE_UNITS_REF,
      payload: { uom_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteUnitsRefs = (id, onSuccess) => async (dispatch) => {
  try {
    await unitsRefAPI().delete(id);
    dispatch({
      type: DELETE_UNITS_REF,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
