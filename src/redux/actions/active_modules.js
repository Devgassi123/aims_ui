import { 
    SET_ACTIVE_MODULES, REMOVE_FROM_ACTIVE_MODULES, SET_SELECTED_MODULE_LINK,
    SET_ACTIVE_MODULE_DATA, GET_ACTIVE_MODULE_DATA, REMOVE_ACTIVE_MODULE_DATA,
    SET_NEW_SEQUENCE_ACTIVE_MODULES
 } from '../types/reduxtypes';

export function setActiveModules (payload) {
    return{
        type: SET_ACTIVE_MODULES,
        payload: payload
    }
}

export function removeFromActiveModules (payload) {
    return{
        type: REMOVE_FROM_ACTIVE_MODULES,
        payload: payload
    }
}

export function setActiveModuleData (payload) {
    return{
        type: SET_ACTIVE_MODULE_DATA,
        payload: payload
    }
}

export function getActiveModuleData (payload) {
    return{
        type: GET_ACTIVE_MODULE_DATA,
        payload: payload
    }
}

export function removeActiveModuleData (payload) {
    return{
        type: REMOVE_ACTIVE_MODULE_DATA,
        payload: payload
    }
}

export function setNewSequenceOfActiveModules (payload) {
    return{
        type: SET_NEW_SEQUENCE_ACTIVE_MODULES,
        payload: payload
    }
}

export function setSelectedModuleLink (payload) {
    return{
        type: SET_SELECTED_MODULE_LINK,
        payload: payload
    }
}