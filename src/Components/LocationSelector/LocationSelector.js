import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, Dialog, IconButton, Typography,
    DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent, DialogActions as MuiDialogActions
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { LocationSelectorTable } from './LocationSelectorTable';
import { useToasts } from 'react-toast-notifications';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function LocationSelectorDialog({ open, handleClose, setSelectedLocation, locationType, validationCode }) {
    const { addToast } = useToasts();
    const [locationSelected, setLocationSelected] = React.useState([]);

    const handleOnSelectLocation = () => {
        if (locationSelected.length > 0) {
            // console.log("itemSelected[0]", itemSelected[0])
            setSelectedLocation(locationSelected[0]);
            handleClose();
        }
        else {
            addToast("Please select location first", {
                appearance: "info"
            })
        }
    }

    const onDblClick = (selected) => {
        setSelectedLocation(selected);
        handleClose();
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth={true} maxWidth="md">
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>Select Location</DialogTitle>
            <DialogContent dividers>
                <LocationSelectorTable
                    rowSelected={locationSelected}
                    setRowSelected={setLocationSelected}
                    locationType={locationType}
                    onDblClick={onDblClick}
                    validationCode={validationCode}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleOnSelectLocation} color="primary" disabled={locationSelected.length === 0}>
                    Select
                </Button>
            </DialogActions>
        </Dialog>
    );
}

LocationSelectorDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    setSelectedLocation: PropTypes.func.isRequired,
    locationType: PropTypes.string.isRequired
}