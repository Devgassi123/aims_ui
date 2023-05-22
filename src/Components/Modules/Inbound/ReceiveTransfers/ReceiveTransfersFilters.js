import React, { useEffect, useState } from 'react';
import serialize from 'form-serialize';
import {
    Box, Button,
    Checkbox,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Slide,
} from '@material-ui/core';

import { CarrierOptionBox, POStatusOptionBox } from '../../../ReferenceOptionBox/ReferenceOptionBox';
import OrganizationSelectorDialog from '../../../OrganizationSelector/OrganizationSelector';
import CentralizedTextField from '../../../Inputs/CentralizedTextField/CentralizedTextField';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function ReceiveTransfersFilters(props) {
    const { open, handleClose, filters, setFilters, setReload, onFilter } = props;

    const [clearValue, setClearValue] = useState(false);
    const [openOrgSelector, setOpenOrgSelector] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState({
        organizationId: ""
    })

    useEffect(() => {
        let timeout;

        if (open) {
            if (clearValue) {
                timeout = setTimeout(() => {
                    setClearValue(false)
                }, 1000)
            }
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [open, clearValue]);

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
                if (Object.values(obj).every(val => val === null)) {
                    return {
                        ...obj,
                        applyFilter: false
                    }
                }

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
        // console.log("finalValues", serializedForm)

        if (finalValues.applyFilter) {
            onFilter(finalValues);
        }

        handleClose();
    };

    const clearFilter = async () => {
        setFilters({
            whFromId: null,
            carrierId: null,
            transferDate: null,
            whTransStatusId: null,
            applyFilter: false
        });
        setClearValue(true)
        setReload(true);
        handleClose()
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth="xs"
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <form id="formReturnsFilter" onSubmit={applyFilter}>
                    <DialogTitle id="alert-dialog-slide-title">Filter Transfers</DialogTitle>
                    <DialogContent>
                        {/* SUPPLIER ID */}
                        <Box display="flex">
                            <CentralizedTextField
                                id="whFromIdFilter"
                                name="whFromId"
                                label="Warehouse Id"
                                variant="outlined"
                                value={selectedSupplier.organizationId}
                                onClick={() => setOpenOrgSelector(true)}
                            />
                            <Checkbox
                                id="chkwhFromId"
                                name="chkwhFromId"
                                color="secondary"
                                value
                            />
                        </Box>
                        {/* STATUS */}
                        <Box display="flex">
                            <POStatusOptionBox
                                id="whTransStatusIdFilter"
                                name="whTransStatusId"
                                label="Status"
                                variant="outlined"
                                margin="dense"
                                clearValue={clearValue}
                            />
                            <Checkbox
                                id="chkwhTransStatusId"
                                name="chkwhTransStatusId"
                                color="secondary"
                                value
                            />
                        </Box>
                        {/* CARRIER */}
                        <Box display="flex">
                            <CarrierOptionBox
                                id="carrierIdFilter"
                                name="carrierId"
                                label="Carrier"
                                variant="outlined"
                                margin="dense"
                                clearValue={clearValue}
                            />
                            <Checkbox
                                id="chkcarrierId"
                                name="chkcarrierId"
                                color="secondary"
                                value
                            />
                        </Box>
                        {/* RETURN DATE */}
                        <Box display="flex">
                            <CentralizedTextField
                                id="transferDateFilter"
                                name="transferDate"
                                label="Transfer Date"
                                variant="outlined"
                                type="date"
                            />
                            <Checkbox
                                id="chktransferDate"
                                name="chktransferDate"
                                color="secondary"
                                value
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={clearFilter} color="default">
                            Clear Filter
                        </Button>
                        <Button onClick={handleClose} color="primary" type="submit">
                            Apply Filter
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <OrganizationSelectorDialog
                open={openOrgSelector}
                handleClose={() => setOpenOrgSelector(false)}
                setSelectedOrg={setSelectedSupplier}
                orgType="WAREHOUSE"
            />
        </React.Fragment>
    );
}
