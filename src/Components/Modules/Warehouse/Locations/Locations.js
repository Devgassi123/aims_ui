import React, { useCallback, useEffect, useState } from 'react';
import { 
    Grid 
} from '@material-ui/core';
// REDUX
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModules } from '../../../../redux/actions/active_modules';
//COMPONENTS
import { useCustomStyle } from "../../../../Functions/CustomStyle";
import LocationsTreeView from './LocationsTreeView';
// import { LocationGroupsTable } from "./LocationGroupsTable";
import { LocationsForm } from "./LocationForm/LocationsForm";

export default function Locations(props) {
    const customStyle = useCustomStyle();

    const userMenu = useSelector((state) => state.menuReducer.data);
    const dispatch = useDispatch();
    const stableDispatch =  useCallback(dispatch, []);

    const [locationSelected, setLocationSelected] = React.useState([]);
    const [reload, setReload] = useState(true);

    const currentMainModule = userMenu.filter((module) => module.moduleId === "WH");
    const userAllowedActions = currentMainModule[0].childModules.filter((module) => module.moduleId === "LOCATION")

    useEffect(() => {
        stableDispatch(setActiveModules("Locations"));
        
    }, [stableDispatch]);


    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <LocationsTreeView 
                            selectedNode={locationSelected} 
                            setSelectedNode={setLocationSelected}
                            reload={reload}
                            setReload={setReload}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <LocationsForm 
                            selectedLocation={locationSelected} 
                            setSelectedLocation={setLocationSelected} 
                            setReload={setReload}
                            userAllowedActions={userAllowedActions}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}