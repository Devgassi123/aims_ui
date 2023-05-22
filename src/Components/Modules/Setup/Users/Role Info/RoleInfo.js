import React, { useCallback, useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';

//REDUX
import { useDispatch } from 'react-redux';
import { setActiveModules } from '../../../../../redux/actions/active_modules';
// CUSTOM STYLE
import { useCustomStyle } from "../../../../../Functions/CustomStyle";
// CHILD COMPONENTS
import { RoleInfoTable } from './RoleInfoTable';
import { RoleInfoFormMemoized as RoleInfoForm } from './RoleInfoForm';

export default function RoleInfo(props) {
    const customStyle = useCustomStyle();

    const [rowSelected, setRowSelected] = useState([]);
    const [reload, setReload] = useState(true);

    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, []);

    useEffect(() => {
        stableDispatch(setActiveModules("Role Info"));
    }, [stableDispatch]);

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6} lg={5}>
                        <RoleInfoTable
                            rowSelected={rowSelected}
                            setRowSelected={setRowSelected}
                            reload={reload}
                            setReload={setReload}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={7}>
                        <RoleInfoForm 
                            selectedRow={rowSelected} 
                            setSelectedRow={setRowSelected} 
                            setReload={setReload}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}