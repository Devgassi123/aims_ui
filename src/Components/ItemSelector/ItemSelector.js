import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, Dialog, IconButton, Typography,
    DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent, DialogActions as MuiDialogActions
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { ItemTable } from "./ItemSelectorTable";

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

export default function ItemSelectorDialog({open, handleClose, productId, setProductID}) {
    const [itemSelected, setItemSelected] = React.useState([]);

    const handleOnSelectItem = () => {
        setProductID(itemSelected);
        handleClose();
    }

    const handleOnDoubleClick = (selected) => {
        setProductID(selected);
        handleClose();
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth={true} maxWidth="md">
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>Select Item</DialogTitle>
            <DialogContent dividers>
                <ItemTable
                    productId={productId}
                    rowSelected={itemSelected}
                    setRowSelected={setItemSelected}
                    onDoubleClick={handleOnDoubleClick}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleOnSelectItem} color="primary" disabled={itemSelected.length === 0}>
                    Select
                </Button>
            </DialogActions>
        </Dialog>
    );
}
