import { 
    CREATE_ROLE_DETAILS,
    UPDATE_ROLE_DETAILS,
    DELETE_ROLE_DETAILS,
    SELECT_ALL_ACTIONS_ROLES
} from "../types/reduxtypes";

export const createRoleDetails = (payload) => {
    return{
        type: CREATE_ROLE_DETAILS,
        payload: payload
    }
}

export const updateRoleDetails = (payload) => {
    return{
        type: UPDATE_ROLE_DETAILS,
        payload: payload
    }
}

export const deleteRoleDetails = (payload) => {
    return {
        type: DELETE_ROLE_DETAILS,
        payload: payload
    }
}

export const selectAllRoleActions = (payload) => {
    return {
        type: SELECT_ALL_ACTIONS_ROLES,
        payload: payload
    }
}