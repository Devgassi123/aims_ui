import { receivingAddressRefAPI } from "../api/api";
import {
  CREATE_RECEIVING_ADDRESS_REF,
  GET_RECEIVING_ADDRESS_REF,
  DELETE_RECEIVING_ADDRESS_REF,
  UPDATE_RECEIVING_ADDRESS_REF,
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
    address_type : parseInt(data.address_type),
    time_stamp: standardDateTime,
    last_mod_by_user_id: userSession_account_id,
    last_mod_by_user: userSession_account_name,
  };
};

export const getReceivingAddressRefs = () => async (dispatch) => {
  try {
    const result = await receivingAddressRefAPI().getAll();
    dispatch({
      type: GET_RECEIVING_ADDRESS_REF,
      payload: result.data.document ? result.data.document : [],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};

export const createReceivingAddressRefs = (data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    const res = await receivingAddressRefAPI().create(data);
    const lastInsertedId = res.data.document; // <--- API returns the last inserted id after post
    const updatedData = { ...data, receiving_address_id: lastInsertedId };
    dispatch({
      type: CREATE_RECEIVING_ADDRESS_REF,
      payload: updatedData,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const updateReceivingAddressRefs = (id, data, onSuccess) => async (dispatch) => {
  try {
    data = dataFormatter(data);
    await receivingAddressRefAPI().update(id, data);
    dispatch({
      type: UPDATE_RECEIVING_ADDRESS_REF,
      payload: { receiving_address_id: id, ...data },
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};

export const deleteReceivingAddressRefs = (id, onSuccess) => async (dispatch) => {
  try {
    await receivingAddressRefAPI().delete(id);
    dispatch({
      type: DELETE_RECEIVING_ADDRESS_REF,
      payload: id,
    });
    onSuccess();
  } catch (err) {
    console.log("API Error", err);
  }
};
