import { productAPI } from "../api/api";
import {
  GET_CATEGORY_PRODUCT,
} from "../types/reduxtypes";

export const getProductByCategoryID = (id) => async (dispatch) => {
  try {
    const result = await productAPI(
      `/T_Product/GetProductByCategoryID/`
    ).getbyid(id);
    dispatch({
      type: GET_CATEGORY_PRODUCT,
      payload: result.data.document ? result.data.document : [],
    });
    
  } catch (err) {
    console.log("API Error", err);
  }
};


