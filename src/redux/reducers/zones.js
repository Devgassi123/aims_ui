import { SAVE_ZONE_DETAILS, ZONE_SELECTED_ROW } from '../types/reduxtypes';

const intialState = {
    zone_details: null,
    selected_row: null
};

const zonesReducer = (state = intialState, action = {}) => {
    switch (action.type) {
        case SAVE_ZONE_DETAILS:
            return {
                ...state,
                zone_details: action.payload
            }
        case ZONE_SELECTED_ROW:
            return {
                ...state,
                selected_row: action.payload
            }
        default:
            return state;
    }
};

export default zonesReducer;