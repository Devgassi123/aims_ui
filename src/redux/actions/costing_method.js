import { costingMethodAPI } from "../api/api";
import {
  CREATE_COSTING_METHOD,
  DELETE_COSTING_METHOD,
  GET_COSTING_METHOD,
  UPDATE_COSTING_METHOD,
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

export const getCostingMethods = () => async (dispatch) => {
  try {
    const result = await costingMethodAPI().getAll();
    dispatch({
      type: GET_COSTING_METHOD,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createCostingMethods = (data, onSuccess) => async (
  dispatch
) => {
  try {
    data = dataFormatter(data);
    const res = await costingMethodAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, costing_method_id: lastInsertedId };
    dispatch({
      type: CREATE_COSTING_METHOD,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateCostingMethods = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    await costingMethodAPI().setNewHomeCostingMethod(id, data);
    dispatch({
      type: UPDATE_COSTING_METHOD,
      payload: { costing_method_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const setNewHomeCostingMethodAction = (id, data, onSuccess, updatedList) => async (
  dispatch
) => {
  try {
    await costingMethodAPI(
      `/Ui_Costing_Method/SetNewHomeCostingMethod/`
    ).setNewHomeCostingMethod(id, data);
    dispatch({
      type: UPDATE_COSTING_METHOD,
      payload: { costing_method_id: id, ...data },
    });
    dispatch({
      type: GET_COSTING_METHOD,
      payload: updatedList,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteCostingMethods = (id, onSuccess) => async (dispatch) => {
  try {
    await costingMethodAPI().delete(id);
    dispatch({
      type: DELETE_COSTING_METHOD,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
