import {
  GET_PIN,
  UPDATE_PIN,
} from "../types/reduxtypes";


export const getPin = () => async (dispatch) => {
  try {
    
    dispatch({
      type: GET_PIN,
      payload: [{pin_id: 1 , pinned : false }],
    });
  } catch (err) {
    console.log("API Error", err);
  }
};



export const updatePin = (data) => async (dispatch) => {
  try {
    
    dispatch({
      type: UPDATE_PIN,
      payload: { pin_id: 1, ...data },
    });
  } catch (err) {
    console.log("API Error", err);
  }
};


