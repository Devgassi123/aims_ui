import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Grid
} from '@material-ui/core';
import { Collapse } from '@mui/material'

import { useDispatch } from 'react-redux';
import { setActiveModules } from '../../../../redux/actions/active_modules';

import { useCustomStyle } from "../../../../Functions/CustomStyle";

import { POTable } from './POTable';
import { POForm } from './POForm';
// import POHeaderAndDetailsRpt from './POReport/POHeaderAndDetailsRpt';

export default function PO(props) {
    const customStyle = useCustomStyle();

    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, []);

    const [reload, setReload] = useState(true);
    const [softReload, setSoftReload] = useState(false); //will be triggered when user done receiving or putaway process
    const [rowSelected, setRowSelected] = React.useState([]);
    const [fullWidthTbl, setFullWidthTbl] = useState(true);

    useEffect(() => {
        stableDispatch(setActiveModules("Purchase Order"));
    }, [stableDispatch]);

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <Grid container>
                    <Grid item xs={12}>
                        <Box display='flex' width='100%'>
                            {/* <Box width="70%"> */}
                                <Collapse orientation="horizontal" in={fullWidthTbl} collapsedSize="0%">
                                    <POTable
                                        reload={reload}
                                        setReload={setReload}
                                        rowSelected={rowSelected}
                                        setRowSelected={setRowSelected}
                                        setFullWidthTbl={setFullWidthTbl}
                                        softReload={softReload}
                                        setSoftReload={setSoftReload}
                                    />
                                </Collapse>
                            {/* </Box> */}
                            <Box width="100%" hidden={fullWidthTbl}>
                                <POForm
                                    selectedRow={rowSelected}
                                    setSelectedRow={setRowSelected}
                                    setReloadHdrTable={setReload}
                                    setSoftReloadHdrTable={setSoftReload}
                                    setFullWidthTbl={setFullWidthTbl}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}