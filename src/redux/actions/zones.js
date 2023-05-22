import { SAVE_ZONE_DETAILS, ZONE_SELECTED_ROW } from '../types/reduxtypes';

export const saveZoneDetails = (payload) => {
    return {
        type: SAVE_ZONE_DETAILS,
        payload: payload
    }
}

export const setZoneSelectedRow = (payload) => {
    return {
        type: ZONE_SELECTED_ROW,
        payload: payload
    }
}