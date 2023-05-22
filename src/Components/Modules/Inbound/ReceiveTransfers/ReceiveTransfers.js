import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Grid
} from '@material-ui/core';
import { Collapse } from '@mui/material'

import { useDispatch } from 'react-redux';
import { setActiveModules } from '../../../../redux/actions/active_modules';

import { useCustomStyle } from "../../../../Functions/CustomStyle";

import { ReceiveTransfersTable } from './ReceiveTransfersTable';
import { ReceiveTransfersForm } from './ReceiveTransfersForm/ReceiveTransfersForm';

export default function ReceiveTransfers(props) {
    const customStyle = useCustomStyle();

    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, []);

    const [reload, setReload] = useState(true);
    const [softReload, setSoftReload] = useState(false); //will be triggered when user done receiving or putaway process
    const [rowSelected, setRowSelected] = React.useState([]);
    const [fullWidthTbl, setFullWidthTbl] = useState(true);

    useEffect(() => {
        stableDispatch(setActiveModules("Receive Transfer"));
    }, [stableDispatch]);

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <Grid container>
                    <Grid item xs={12}>
                        <Box display='flex' width='100%'>
                            <Collapse orientation="horizontal" in={fullWidthTbl} collapsedSize="0%">
                                <ReceiveTransfersTable
                                    reload={reload}
                                    setReload={setReload}
                                    rowSelected={rowSelected}
                                    setRowSelected={setRowSelected}
                                    setFullWidthTbl={setFullWidthTbl}
                                    softReload={softReload}
                                    setSoftReload={setSoftReload}
                                />
                            </Collapse>
                            <Box width="100%" hidden={fullWidthTbl}>
                                <ReceiveTransfersForm
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