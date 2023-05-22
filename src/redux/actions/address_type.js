import { addressTypeRefAPI } from "../api/api";
import {
  GET_ADDRESS_TYPE_REF,
} from "../types/reduxtypes";

export const getAddressTypeRefs = () => async (dispatch) => {
  try {
    const result = await addressTypeRefAPI().getAll();
    dispatch({
      type: GET_ADDRESS_TYPE_REF,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};
