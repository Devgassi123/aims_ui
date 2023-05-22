import React, { useCallback, useEffect, useState } from 'react';
import {
    Grid
} from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import { setActiveModules } from '../../../../../redux/actions/active_modules';

import { useCustomStyle } from "../../../../../Functions/CustomStyle";
import { UOMRefTable } from './UOMRefTable';
import { UOMRefForm } from './UOMRefForm';
// import { AreaForm } from "./AreasForm";


export default function UOMRef(props) {
    const customStyle = useCustomStyle();

    const userMenu = useSelector((state) => state.menuReducer.data);
    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, []);

    const [rowSelected, setRowSelected] = React.useState([]);
    const [reload, setReload] = useState(true);

    const currentMainModule = userMenu.filter((module) => module.moduleId === "BASICSETT");
    const userAllowedActions = currentMainModule[0].childModules.filter((module) => module.moduleId === "UOMREF")

    useEffect(() => {
        stableDispatch(setActiveModules("UOM Ref"));
    }, [stableDispatch]);

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <UOMRefTable
                            rowSelected={rowSelected}
                            setRowSelected={setRowSelected}
                            reload={reload}
                            setReload={setReload}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <UOMRefForm
                            selectedRow={rowSelected}
                            setSelectedRow={setRowSelected}
                            setReload={setReload}
                            userAllowedActions={userAllowedActions}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}