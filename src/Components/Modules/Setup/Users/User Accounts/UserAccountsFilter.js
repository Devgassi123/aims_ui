import React, { useState, useEffect } from 'react';
import serialize from 'form-serialize';
import {
    Box, Button,
    Checkbox,
    Dialog, DialogActions, DialogContent, DialogTitle,
    MenuItem,
    Slide,
    TextField
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { RoleOptionBox } from '../../../../ReferenceOptionBox/ReferenceOptionBox';
import CentralizedSelectBox from '../../../../Inputs/CentralizedSelectBox/CentalizedSelectBox';
import moment from 'moment';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

function Filters(props) {
    const { open, handleClose, filters, setFilters, setReload,  onFilter } = props;

    const [clearValue, setClearValue] = useState(false);

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
                if(Object.values(obj).every(val => val === null)) {
                    return {
                        ...obj,
                        applyFilter: false
                    }
                }

                return {
                    ...obj,
                    inactive: obj.inactive ? Number(obj.inactive) : null,
                    applyFilter: true
                };
            })
    };

    const applyFilter = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const serializedForm = serialize(form, { hash: true, disabled: true, empty: true });
        const finalValues = await dataFormatter(serializedForm)

        if(finalValues.applyFilter) {
            onFilter(finalValues);
        }

        handleClose();
    };

    const clearFilter = async () => {
        setFilters({
            accessRightId: null,
            inactive: null,
            accountExpiry: null,
            applyFilter: false
        });
        setClearValue(true)
        setReload(true) // to reload the get all
        handleClose()
    };

    if(!open) {
        return null;
    }

    return (
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
            <form onSubmit={applyFilter}>
                <DialogTitle id="alert-dialog-slide-title">Filter Accounts</DialogTitle>
                <DialogContent>
                    <Alert severity="info">Tick the corresponding checkbox to apply the filter.</Alert>
                    <Box display="flex">
                        <RoleOptionBox
                            id="accessRightIdFilter"
                            name="accessRightId"
                            label="Role"
                            variant="outlined"
                            size="small"
                            margin="dense"
                            clearValue={clearValue}
                        />
                        <Checkbox
                            id="chkaccessRightId"
                            name="chkaccessRightId"
                            color="secondary"
                            value
                        />
                    </Box>
                    {/* Inactive */}
                    <Box display="flex">
                        <CentralizedSelectBox
                            id="inactiveFilter"
                            name="inactive"
                            label="Inactive"
                            variant="outlined"
                            margin="dense"
                            clearValue={clearValue}
                        >
                            <MenuItem value={0}>NO</MenuItem>
                            <MenuItem value={1}>YES</MenuItem>
                        </CentralizedSelectBox>
                        <Checkbox
                            id="chkinactive"
                            name="chkinactive"
                            color="secondary"
                            value
                        />
                    </Box>
                    {/* ACCOUNT EXPIRATION */}
                    <Box display="flex">
                        <TextField
                            id="accountExpiryFilter"
                            name="accountExpiry"
                            label="Account Expiration"
                            variant="outlined"
                            type="date"
                            size="small"
                            margin="dense"
                            value={moment(new Date()).format("YYYY-MM-DD")}
                            fullWidth
                        />
                        <Checkbox
                            id="chkaccountExpiry"
                            name="chkaccountExpiry"
                            color="secondary"
                            value
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={clearFilter} color="secondary">
                        Clear Filter
                    </Button>
                    <Button type='submit' color="primary">
                        Apply Filter
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export const UserAccountsFilters = React.memo(Filters, (prevProps, nextProps) => {
    if((prevProps.filters === nextProps.filters) && (prevProps.open && nextProps.open)) {
        return true;
    }
    return false;
})