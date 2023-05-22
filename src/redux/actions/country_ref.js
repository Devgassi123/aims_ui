import { countryRefAPI } from "../api/api";
import { CREATE_COUNTRY_REF, GET_COUNTRY_REF,DELETE_COUNTRY_REF,UPDATE_COUNTRY_REF } from "../types/reduxtypes";

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

export const getCountryRefs = () => async (dispatch) => {
  try {
    const result = await countryRefAPI().getAll();
    dispatch({
      type: GET_COUNTRY_REF,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createCountryRefs = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await countryRefAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, id: lastInsertedId };
    dispatch({
      type: CREATE_COUNTRY_REF,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateCountryRefs = (id, data, onSuccess) => async (dispatch) => {
  try {
    await countryRefAPI().update(id, data);
    dispatch({
      type: UPDATE_COUNTRY_REF,
      payload: { id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteCountryRefs = (id, onSuccess) => async (dispatch) => {
  try {
    await countryRefAPI().delete(id);
    dispatch({
      type: DELETE_COUNTRY_REF,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
