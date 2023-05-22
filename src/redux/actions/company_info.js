import { standardDateTimeFormatter } from "../../Functions/Util";
import { companyInfoAPI } from "../api/api";
import { GET_COMPANY_INFO, UPDATE_COMPANY_INFO } from "../types/reduxtypes";

/* Data corrector before dispatching */
const dataFormatter = (data) => {
  const standardDateTime = standardDateTimeFormatter(new Date());

  /* Session Data */
  // const userSession_account_id = 1;
  // const userSession_account_name = "admin";

  return {
    ...data,
    // last_mod_at: data.last_mod_at ? data.last_mod_at : standardDateTime,
    time_stamp: standardDateTime,
    // last_mod_by_user_id: userSession_account_id,
    // last_mod_by_user: userSession_account_name,
  };
};

export const getCompanyInfo = () => async (dispatch) => {
  try {
    const result = await companyInfoAPI().getAll();
    dispatch({
      type: GET_COMPANY_INFO,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateCompanyInfo = (id, data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    await companyInfoAPI().update(id, data);
    dispatch({
      type: UPDATE_COMPANY_INFO,
      payload: { company_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
