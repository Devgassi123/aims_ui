import React, { useEffect, useState } from 'react';
import serialize from 'form-serialize';
import {
    Box, Button,
    Checkbox,
    Dialog, DialogActions, DialogContent, DialogTitle,
    MenuItem,
    Slide,
    TextField
} from '@material-ui/core';

import { AreaOptionBox, LocationTypeOptionBox, LocationGroupOptionBox, AisleOptionBox, BayOptionBox } from '../../../ReferenceOptionBox/ReferenceOptionBox';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function LocationsFilter(props) {
    const { open, handleClose, filters, setFilters, setReload } = props;

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

        // console.log("finalValues", serializedForm)
        setFilters(finalValues);
        handleClose();
    };

    const clearFilter = async () => {
        setFilters({
            locationTypeId: null,
            locationGroupId: null,
            areaId: null,
            inactive: null,
            aisleCode: null,
            bayCode: null,
            applyFilter: false
        });
        setClearValue(true)
        setReload(true);
        handleClose()
    };

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
            <form id="formLogsFilter" onSubmit={applyFilter}>
                <DialogTitle id="alert-dialog-slide-title">Filter Locations</DialogTitle>
                <DialogContent>
                    {/* AREA */}
                    <Box display="flex">
                        <AreaOptionBox
                            id="areaIdFilter"
                            name="areaId"
                            label="Area"
                            variant="outlined"
                            margin="dense"
                            clearValue={clearValue}
                        />
                        <Checkbox
                            id="chkareaId"
                            name="chkareaId"
                            color="secondary"
                            value
                        />
                    </Box>
                    {/* LOCATION TYPE */}
                    <Box display="flex">
                        <LocationTypeOptionBox
                            id="locationTypeIdFilter"
                            name="locationTypeId"
                            label="Location Type"
                            variant="outlined"
                            margin="dense"
                            clearValue={clearValue}
                        />
                        <Checkbox
                            id="chklocationTypeId"
                            name="chklocationTypeId"
                            color="secondary"
                            value
                        />
                    </Box>
                    {/* LOCATION GRP */}
                    <Box display="flex">
                        <LocationGroupOptionBox
                            id="locationGroupIdFilter"
                            name="locationGroupId"
                            label="Location Group"
                            variant="outlined"
                            margin="dense"
                            clearValue={clearValue}
                        />
                        <Checkbox
                            id="chklocationGroupId"
                            name="chklocationGroupId"
                            color="secondary"
                            value
                        />
                    </Box>
                    {/* AISLE */}
                    <Box display="flex">
                        <AisleOptionBox
                            id="aisleCodeFilter"
                            name="aisleCode"
                            label="Aisle Code"
                            variant="outlined"
                            margin="dense"
                            clearValue={clearValue}
                        />
                        <Checkbox
                            id="chkaisleCode"
                            name="chkaisleCode"
                            color="secondary"
                            value
                        />
                    </Box>
                    {/* BAY */}
                    <Box display="flex">
                        <BayOptionBox
                            id="bayCodeFilter"
                            name="bayCode"
                            label="Bay Code"
                            variant="outlined"
                            margin="dense"
                            clearValue={clearValue}
                        />
                        <Checkbox
                            id="chkbayCode"
                            name="chkbayCode"
                            color="secondary"
                            value
                        />
                    </Box>
                    {/* INACTIVE */}
                    <Box display="flex">
                        <TextField
                            id="inactiveFilter"
                            name="inactive"
                            label="Inactive"
                            variant="outlined"
                            size="small"
                            margin="dense"
                            defaultValue={""}
                            select
                            fullWidth
                        >
                            <MenuItem value={""}>Select Status</MenuItem>
                            <MenuItem value={1}>True</MenuItem>
                            <MenuItem value={0}>False</MenuItem>
                        </TextField>
                        <Checkbox
                            id="chkinactive"
                            name="chkinactive"
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
    );
}
