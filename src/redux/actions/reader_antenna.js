import { readerAntennaAPI } from "../api/api";
import {
  GET_READER_ANTENNA,
} from "../types/reduxtypes";

export const getReaderAntennas = () => async (dispatch) => {
  try {
    const result = await readerAntennaAPI().getAll();
    dispatch({
      type: GET_READER_ANTENNA,
      payload: result.data.document,
    });
  } catch (err) {
    console.log("API Error", err);
  }
};
