import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import { Collapse } from '@mui/material';

import { useDispatch } from 'react-redux';
import { setActiveModules } from '../../../../redux/actions/active_modules';

import { useCustomStyle } from "../../../../Functions/CustomStyle";
import { MemoizedAuditTrailFilters as AuditTrailFilters } from './AuditTrailFilters';
import { AuditTrailTable } from './AuditTrailTable';
import { MemoizedAuditTrailDetails as AuditTrailDetails } from './AuditTrailDetails';

export default function AuditTrail(props) {
    const customStyle = useCustomStyle();

    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, []);

    const [reload, setReload] = useState(true);
    const [rowSelected, setRowSelected] = useState([]);
    const [filters, setFilters] = useState({
        recordId: null,
        auditDateFrom: null,
        auditDateTo: null,
        userAccountId: null,
        transactionTypeId: null,
        applyFilter: false
    })

    useEffect(() => {
        stableDispatch(setActiveModules("Audit Trail"));
    }, [stableDispatch]);

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <AuditTrailFilters 
                            filters={filters} 
                            setFilters={setFilters} 
                            setReload={setReload}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={9} lg={9}>
                        <Box display={"flex"} width="100%">
                            <Collapse orientation="horizontal" in={rowSelected.length === 0} collapsedSize="50%">
                                <AuditTrailTable
                                    reload={reload}
                                    setReload={setReload}
                                    rowSelected={rowSelected}
                                    setRowSelected={setRowSelected}
                                    filters={filters}
                                    setFilters={setFilters}
                                />
                            </Collapse>
                            <Box marginLeft={3} display={rowSelected.length > 0 ? "" : "none"} width="100%">
                                {/* <Collapse orientation="horizontal" in={rowSelected.length > 0} unmountOnExit={true}> */}
                                    <AuditTrailDetails 
                                        data={rowSelected}
                                    />
                                {/* </Collapse> */}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}