import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { 
    makeStyles,
    Box, Button,
    Dialog,
    DialogTitle as MuiDialogTitle,
    DialogContent as MuiDialogContent,
    DialogActions as MuiDialogActions,
    IconButton,
    Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';


import CentralizedTextField from '../../../Inputs/CentralizedTextField/CentralizedTextField';
import { ImportErrorTable } from './ImportErrorTable';

const useStyles = makeStyles((theme) => ({
    link: {
        color: "green",
        cursor: "pointer",
        "&:hover": {
            "transform": 'translateY(-2px)',
            color: "blue"
        }
    },
    typographyHeader: {
        color: "#43a047"
    }
}));

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        backgroundColor: "#43a047",
        color: "#e8f5e9"
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[50],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;

    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h5">{children}</Typography>
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
        borderColor: "#43a047",
        borderWidth: "5px",
        borderStyle: "solid",
        borderBottom: 0
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
        borderColor: "#43a047",
        borderWidth: "5px",
        borderStyle: "solid",
        borderTopStyle: "none"
    },
}))(MuiDialogActions);

export default function ImportExport(props) {
    const { open, handleClose } = props;

    const classes = useStyles();

    const [errorData, setErrorData] = useState([])

    if (open === false) {
        return null;
    }

    const handleImport = () => {
        setErrorData([])
    }

    return (
        <div>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth="lg"
                fullWidth={true}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Import and Export
                </DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" width='100%'>
                        <Box flexGrow={1} textAlign="center" py={3} borderRight="solid 1px #ccc">
                            <Typography variant='h5' className={classes.typographyHeader}>Import</Typography>
                            <Typography variant='subtitle2' color='textSecondary'>Download template by clicking <u className={classes.link}>here</u></Typography>
                        </Box>
                        <Box flexGrow={1} textAlign="center" py={3}>
                            <Typography variant='h5' className={classes.typographyHeader}>Export</Typography>
                            <Typography variant='subtitle2' color='textSecondary'>Download exported data by clicking <u className={classes.link}>here</u></Typography>
                        </Box>
                    </Box>
                    <CentralizedTextField
                        id="file"
                        name="file"
                        type="file"
                        variant="outlined"
                        margin="normal"
                        label=""
                        inputProps={{accept:".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"}}
                        onChange={handleImport}
                    />
                    <ImportErrorTable
                        data={errorData}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Import Data
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
