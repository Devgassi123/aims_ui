import { companyPreferencesAPI } from "../api/api";
import {
  CREATE_COMPANY_PREFRENCES,
  DELETE_COMPANY_PREFRENCES,
  GET_COMPANY_PREFRENCES,
  UPDATE_COMPANY_PREFRENCES,
} from "../types/reduxtypes";
import { standardDateTimeFormatter } from "../../Functions/Util";

/* Data corrector before dispatching */
const dataFormatter = (data) => {
  const standardDateTime = standardDateTimeFormatter(new Date());
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  

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

export const getCompanyPreferences = () => async (dispatch) => {
  try {
    const result = await companyPreferencesAPI().getAll();
    dispatch({
      type: GET_COMPANY_PREFRENCES,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createCompanyPreferences = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await companyPreferencesAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, company_preferences_id: lastInsertedId };
    dispatch({
      type: CREATE_COMPANY_PREFRENCES,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateCompanyPreferences = (id, data, onSuccess) => async (
  dispatch
) => {
  try {
    await companyPreferencesAPI().update(id, data);
    dispatch({
      type: UPDATE_COMPANY_PREFRENCES,
      payload: { company_preferences_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};



export const deleteCompanyPreferences = (id, onSuccess) => async (dispatch) => {
  try {
    await companyPreferencesAPI().delete(id);
    dispatch({
      type: DELETE_COMPANY_PREFRENCES,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
