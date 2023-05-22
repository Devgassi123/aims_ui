import React, { useCallback, useEffect, useState } from 'react';
import { 
    Grid 
} from '@material-ui/core';
// REDUX
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModules } from '../../../../redux/actions/active_modules';
import { saveZoneDetails } from '../../../../redux/actions/zones';
//COMPONENTS
import { useCustomStyle } from "../../../../Functions/CustomStyle";
import { ZonesTable } from "./ZonesTable";
import { ZonesForm } from "./ZonesForm";


export default function Areas(props) {
    const customStyle = useCustomStyle();

    const zonesReducer = useSelector(state => state.zonesReducer)
    const dispatch = useDispatch();
    const stableDispatch =  useCallback(dispatch, []);

    const [data, setData] = useState([]);
    const [rowSelected, setRowSelected] = React.useState([]);

    useEffect(() => {
        stableDispatch(setActiveModules("Zones"));
        setData([
            {zoneID: 1, zoneName: "Zone 1", warehouseID: 1, areaName: "Area 1", inactive: 0},
            {zoneID: 2, zoneName: "Zone 2", warehouseID: 1, areaName: "Area 2", inactive: 1}
        ]);
        
    }, [stableDispatch]);

    useEffect(() => {
        if(zonesReducer.zone_details !== null) {
            setRowSelected([zonesReducer.zone_details.zoneID])
        }

        return () => {
            saveDataToRedux();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveDataToRedux = () => {
        dispatch(saveZoneDetails({
            zoneID: document.getElementById("zoneID").value,
            branchID: document.getElementById("branchID").value,
            warehouseID: document.getElementById("warehouseID").value,
            areaID: document.getElementById("zoneID").value,
            zoneName: document.getElementById("zoneName").value,
            inactive: document.getElementsByName("inactive").value,
            remarks: document.getElementById("remarks").value,
        }));
    };

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <ZonesTable 
                            data={data} 
                            rowSelected={rowSelected}
                            setRowSelected={setRowSelected}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <ZonesForm selectedRow={rowSelected} setRowSelected={setRowSelected} />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}