import React, { useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setActiveModules } from '../../../../redux/actions/active_modules';

import { useCustomStyle } from "../../../../Functions/CustomStyle";
import { WarehouseForm } from "./WarehouseForm";


export default function Warehouses(props) {
    const customStyle = useCustomStyle();

    const userMenu = useSelector((state) => state.menuReducer.data);
    const dispatch = useDispatch();
    const stableDispatch =  useCallback(dispatch, []);

    const currentMainModule = userMenu.filter((module) => module.moduleId === "WH");
    const userAllowedActions = currentMainModule[0].childModules.filter((module) => module.moduleId === "WHINFO")

    useEffect(() => {
        stableDispatch(setActiveModules("Warehouse Info"));
    }, [stableDispatch]);

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <WarehouseForm userAllowedActions={userAllowedActions} />
                {/* <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <WarehousesTable 
                            data={data} 
                            rowSelected={rowSelected}
                            setRowSelected={setRowSelected}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <WarehouseForm selectedRow={rowSelected} />
                    </Grid>
                </Grid> */}
            </div>
        </div>
    );
}