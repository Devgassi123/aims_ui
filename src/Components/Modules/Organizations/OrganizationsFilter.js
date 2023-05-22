import React from 'react';
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    MenuItem,
    Slide,
    TextField
} from '@material-ui/core';
import serialize from 'form-serialize';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function OrganizationFilters(props) {
    const { open, handleClose, onFilter, setReload, setFilters } = props;

    const dataFormatter = (obj) => {
        return {
            organizationTypeId: obj.organizationTypeID === "" ? null : obj.organizationTypeID,
            inactive: obj.inactive === "" ? null : Number(obj.inactive),
            applyFilter: true
        };
    };

    const applyFilter = (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const serializedForm = serialize(form, { hash: true, disabled: true, empty: true });
        const finalValues = dataFormatter(serializedForm)

        // console.log("finalValues", serializedForm)
        onFilter(finalValues);
        handleClose();
    };

    const clearFilter = async () => {
        setFilters({
            organizationTypeId: null,
            inactive: null,
            applyFilter: false
        })
        setReload(true);
        handleClose();
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
                <DialogTitle id="alert-dialog-slide-title">{"Filter Organizations"}</DialogTitle>
                <DialogContent>
                    <TextField
                        id="organizationTypeIdFilter"
                        name="organizationTypeID"
                        label="Organization Type"
                        variant="outlined"
                        size="small"
                        margin="dense"
                        defaultValue=""
                        select
                        fullWidth
                    >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="CARRIER">Carrier</MenuItem>
                        <MenuItem value="CONSIGNEE">Consignee</MenuItem>
                        <MenuItem value="SUPPLIER">Supplier</MenuItem>
                    </TextField>
                    <TextField
                        id="inactiveFilter"
                        name="inactive"
                        label="Inactive"
                        variant="outlined"
                        size="small"
                        margin="dense"
                        defaultValue=""
                        select
                        fullWidth
                    >
                        <MenuItem value={""}>Select Status</MenuItem>
                        <MenuItem value={1}>True</MenuItem>
                        <MenuItem value={0}>False</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={clearFilter} color="secondary">
                        Clear Filter
                    </Button>
                    <Button color="primary" type="submit">
                        Apply Filter
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
