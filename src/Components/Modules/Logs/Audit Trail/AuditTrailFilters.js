import React from 'react';
import serialize from 'form-serialize';

import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, Box, Checkbox, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useCustomStyle } from "../../../../Functions/CustomStyle";

import CentralizedTextField from '../../../Inputs/CentralizedTextField/CentralizedTextField';
import { CardActions } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    root: {
        height: 210,
        flexGrow: 1,
        maxWidth: 400,
    },
    cardContent: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
        height: "100%",
        minHeight: 693,
        maxHeight: 693,
        overflow: "auto"
    },
    floatRight: {
        // float: "right",
        float: "right"
    },
    alert: {
        marginBottom: theme.spacing(3)
    }
}));

function AuditTrailFilters({ filters, setFilters, setReload }) {
    const customStyle = useCustomStyle();
    const classes = useStyles();

    const dataFormatter = async (obj) => {
        return new Promise((resolve, reject) => {
            // set as null the filters that were not ticked and the ones were ticked but no value 
            Object.keys(filters).forEach((key, index, array) => {
                if (obj[`chk${key}`] === "") {
                    obj[key] = null
                }
                else {
                    if (obj[key] === "") {
                        obj[key] = null
                    }
                }

                if (index === array.length - 1) resolve();
            })
        })
            .then(() => {
                // remove keys with "chk" which is value from checkboxes
                Object.keys(obj).forEach((key) =>
                    key.includes("chk") && delete obj[key]
                )
            })
            .then(() => {
                //check if all filters are null. If so, don't apply filter.
                // if(Object.values(obj).every(val => val === null)) {
                //     return {
                //         ...obj,
                //         applyFilter: false
                //     }
                // }

                return {
                    ...obj,
                    applyFilter: true
                };
            })
    };

    const applyFilter = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const serializedForm = serialize(form, { hash: true, disabled: true, empty: true });
        const finalValues = await dataFormatter(serializedForm)
        // console.log("FORM", finalValues)

        if(finalValues.applyFilter) {
            setFilters(finalValues);
            setReload(true)
        }
    };

    const clearFilter = async () => {
        const form = document.querySelector("#formLogsFilter");
        form.reset();

        setFilters({
            recordId: null,
            auditDateFrom: null,
            auditDateTo: null,
            userAccountId: null,
            transactionTypeId: null,
            applyFilter: false
        });
        setReload(true);
    };

    return (
        <Card>
            <CardHeader
                title="Filter Logs"
                className={customStyle.cardHdr}
            />
            <form id="formLogsFilter" onSubmit={applyFilter}>
                <CardContent className={classes.cardContent}>
                    <Alert severity="info" className={classes.alert}>
                        <AlertTitle>Info</AlertTitle>
                        <u>Tick</u> the corresponding filter to apply
                    </Alert>
                    <Box display="flex">
                        <CentralizedTextField
                            id="recordId"
                            name="recordId"
                            label="Record ID"
                        />
                        <Checkbox id="chkrecordId" name="chkrecordId" color="secondary" value />
                    </Box>
                    <Box display="flex">
                        <CentralizedTextField
                            id="auditDateFrom"
                            name="auditDateFrom"
                            label="From Date"
                            type="date"
                        />
                        <Checkbox id="chkauditDateFrom" name="chkauditDateFrom" color="secondary" value />
                    </Box>
                    <Box display="flex">
                        <CentralizedTextField
                            id="auditDateTo"
                            name="auditDateTo"
                            label="To Date"
                            type="date"
                        />
                        <Checkbox id="chkauditDateTo" name="chkauditDateTo" color="secondary" value />
                    </Box>
                    <Box display="flex">
                        <CentralizedTextField
                            id="userAccountId"
                            name="userAccountId"
                            label="User"
                        />
                        <Checkbox id="chkuserAccountId" name="chkuserAccountId" color="secondary" value />
                    </Box>
                    <Box display="flex">
                        <CentralizedTextField
                            id="transactionTypeId"
                            name="transactionTypeId"
                            label="Module"
                        />
                        <Checkbox id="chktransactionTypeId" name="chktransactionTypeId" color="secondary" value />
                    </Box>
                    <CardActions className={classes.floatRight}>
                        <Button variant="contained" color="default" onClick={clearFilter}>
                            Clear Filter
                        </Button>
                        <Button type='submit' variant="contained" color="secondary">
                            Apply Filter
                        </Button>
                    </CardActions>
                </CardContent>
            </form>
        </Card>
    )
};

export const MemoizedAuditTrailFilters = React.memo(AuditTrailFilters)