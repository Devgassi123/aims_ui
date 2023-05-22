import React, { useCallback, useEffect, useState } from 'react';
import { 
    Grid 
} from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import { setActiveModules } from '../../../redux/actions/active_modules';

import { useCustomStyle } from "../../../Functions/CustomStyle";
import { OrganizationTable } from "./OrganizationsTable";
import { OrganizationForm } from "./OrganizationsForm/OrganizationsForm";


export default function Organizations(props) {
    const customStyle = useCustomStyle();

    const userMenu = useSelector((state) => state.menuReducer.data);
    const dispatch = useDispatch();
    const stableDispatch =  useCallback(dispatch, []);

    const [reload, setReload] = useState(true);
    const [rowSelected, setRowSelected] = React.useState([]);

    useEffect(() => {
        stableDispatch(setActiveModules("Organizations"));
    }, [stableDispatch]);

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={7} lg={7}>
                        <OrganizationTable  
                            rowSelected={rowSelected}
                            setRowSelected={setRowSelected}
                            reload={reload}
                            setReload={setReload}
                            userAllowedActions={userMenu.filter((module) => module.moduleId === "ORGANIZATION")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} lg={5}>
                        <OrganizationForm 
                            selectedRow={rowSelected} 
                            setSelectedRow={setRowSelected} 
                            setReload={setReload}
                            userAllowedActions={userMenu.filter((module) => module.moduleId === "ORGANIZATION")}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}