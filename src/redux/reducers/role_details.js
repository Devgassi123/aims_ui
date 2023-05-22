import {
    CREATE_ROLE_DETAILS,
    UPDATE_ROLE_DETAILS,
    DELETE_ROLE_DETAILS,
    SELECT_ALL_ACTIONS_ROLES
} from "../types/reduxtypes";

const initialState = {
    details: []
}
var newDetails;

const roleDetailsReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case CREATE_ROLE_DETAILS:
            return {
                ...state,
                details: action.payload
            }
        case UPDATE_ROLE_DETAILS:
            newDetails = state.details.filter(({ headerModuleId, headerActionTypeId }) =>
                (headerModuleId !== action.payload.headerModuleId) || (headerActionTypeId !== action.payload.headerActionTypeId)
            );

            return {
                ...state,
                details: [
                    action.payload,
                    ...newDetails
                ]
            }
        case DELETE_ROLE_DETAILS:
            newDetails = state.details.filter(({ moduleId, actionTypeId }) => (moduleId !== action.payload.moduleId) || (actionTypeId !== action.payload.actionTypeId));

            return {
                ...state,
                details: newDetails
            }
        case SELECT_ALL_ACTIONS_ROLES:
            //get all the objects that belongs to same modules.
            let moduleActions = state.details.filter(({ headerModuleId, enabled }) => (headerModuleId === action.payload.module && enabled === true));
            let newModuleDetails = [];

            //remove the old records of the module
            newDetails = state.details.filter(({ headerModuleId}) => (headerModuleId !== action.payload.module));

            //loop each object and change the "allow" value to payload: allow (true/false)
            moduleActions.forEach((moduleAction) => {
                newModuleDetails.push({
                    ...moduleAction,
                    allow: action.payload.allow
                })
            })

            return {
                ...state,
                details: [
                    ...newDetails,
                    ...newModuleDetails
                ]
            }
        default:
            return state;
    }
}

export default roleDetailsReducer;