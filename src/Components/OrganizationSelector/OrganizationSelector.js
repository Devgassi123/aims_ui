import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, Dialog, IconButton, Typography,
    DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent, DialogActions as MuiDialogActions
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { OrganizationSelectorTable } from './OrganizationSelectorTable';
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

export default function OrganizationSelectorDialog({ open, handleClose, setSelectedOrg, orgType }) {
    const { addToast } = useToasts();

    const [itemSelected, setItemSelected] = React.useState([]);

    const handleOnSelectItem = () => {
        // console.log("itemSelected[0]", itemSelected[0])
        if (itemSelected.length > 0) {
            setSelectedOrg(itemSelected[0]);
            handleClose();
        }
        else {
            addToast("Select organization first!", {
                appearance: "info"
            })
        }
    }

    const handleOnDoubleClick = (selected) => {
        setSelectedOrg(selected);
        handleClose();
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth={true} maxWidth="md">
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>Select Organization</DialogTitle>
            <DialogContent dividers>
                <OrganizationSelectorTable
                    rowSelected={itemSelected}
                    setRowSelected={setItemSelected}
                    orgType={orgType}
                    onDblClickRow={handleOnDoubleClick}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleOnSelectItem} color="primary">
                    Select
                </Button>
            </DialogActions>
        </Dialog>
    );
}
