import { 
    SET_ACTIVE_MODULES, REMOVE_FROM_ACTIVE_MODULES, SET_SELECTED_MODULE_LINK,
    SET_ACTIVE_MODULE_DATA, REMOVE_ACTIVE_MODULE_DATA,
    SET_NEW_SEQUENCE_ACTIVE_MODULES
} from '../types/reduxtypes';

const initialState = {
    opened_modules: 0, //for iteration only
    modules: [],
    selected_module: "",
    selected_module_link: "",
    modules_data: []
}

const activeModulesReducer = ( state = initialState, action = {}) => {
    switch (action.type) {
        case SET_ACTIVE_MODULES:
            return {
                ...state,
                selected_module: action.payload,
                modules: 
                    state.modules.findIndex((module) => module.moduleName === String(action.payload)) === -1 // not existing in active modules
                        ? state.modules.concat({
                            id: `module-${state.opened_modules + 1}`,
                            moduleName: action.payload
                          })
                        : state.modules,
                opened_modules: 
                    state.modules.findIndex((module) => module.moduleName === String(action.payload)) === -1 // not existing in active modules
                        ? state.opened_modules + 1
                        : state.opened_modules
            }
        case REMOVE_FROM_ACTIVE_MODULES:
            return {
                ...state,
                selected_module: 
                    // action.payload === state.selected_module //close the selected module
                        state.modules.findIndex((module) => module.moduleName === String(action.payload)) === 0 //if the user close the first tab
                            ? (state.modules.length - 1) !== 0 // are/is there tab(s) left if the user close this tab ?
                                ? state.modules[(state.modules.findIndex((module) => module.moduleName === String(action.payload)) + 1)].moduleName //yes? set the next tab as selected module
                                : "" //none? blank the selected module
                            : state.modules[(state.modules.findIndex((module) => module.moduleName === String(action.payload)) - 1)].moduleName, //not closing first tab, set the prev tab as selected
                        // : state.selected_module,
                modules: state.modules.filter(module => module.moduleName !== String(action.payload)),
            }
        case SET_ACTIVE_MODULE_DATA:
            return {
                ...state,
                modules_data: state.modules_data.concat(action.payload)
            }
        case REMOVE_ACTIVE_MODULE_DATA:
            return {
                ...state,
                modules_data: state.modules_data.filter(data => data !== String(action.payload))
            }
        case SET_NEW_SEQUENCE_ACTIVE_MODULES:
            return {
                ...state,
                modules: action.payload
            }
        case SET_SELECTED_MODULE_LINK:
            return {
                ...state,
                selected_module_link: action.payload
            }
        default: return state;
    }
}

export default activeModulesReducer;