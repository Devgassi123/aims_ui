import React, { useState } from 'react';
import { useFormik } from 'formik';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Button,
    CircularProgress,
    Dialog, DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent, DialogActions as MuiDialogActions,
    Grid,
    IconButton,
    Typography,
    Box
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';

import { useToasts } from 'react-toast-notifications';

import { locationAPI, putawayAPI, } from '../../../../../redux/api/api';

import { sessUser } from '../../../../Utils/SessionStorageItems';

import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import LocationSelectorDialog from '../../../../LocationSelector/LocationSelector';
import { LPNPutawayItemsTable } from './LPNPutawayItemsTable';

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

export default function LPNPutaway(props) {
    const { open, onClose, itemInfo } = props;

    if (!open) {
        return null;
    }

    return (
        <div>
            <Dialog
                open={open}
                // onClose={onClose}
                aria-labelledby="customized-dialog-title"
                maxWidth="md"
                fullWidth
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        onClose()
                    }
                }}
            >
                <DialogTitle id="customized-dialog-title" onClose={onClose}>
                    LPN Putaway
                </DialogTitle>
                <MemoizedStepperForm
                    itemInfo={itemInfo}
                    onClose={onClose}
                />
            </Dialog>
        </div>
    );
};

const useStepperStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    stepper: {
        padding: theme.spacing(2, 0)
    }
}));

function PutawayInfo(props) {
    const { formik } = props;

    const { addToast } = useToasts();

    const [showLocationSelector, setShowLocationSelector] = useState(false);
    const [isInvalidVCode, setIsInvalidVCode] = useState({
        invalid: false,
        message: ""
    })

    const defineLocationValidationCode = async () => {

        if (formik.values.putawayLocation.length === 0) {
            setIsInvalidVCode({
                invalid: true,
                message: "Provide location's validation code."
            })

            return;
        }

        try {
            const result = await locationAPI().defineLPNPutawayLoc(formik.values.currentLPN, formik.values.putawayLocation)
            if (result.status === 200) {
                if (result.data.code === 1) {
                    formik.setValues({ ...formik.values, ...result.data.data })
                    formik.setFieldValue("putawayLocation", result.data.data.locationName)
                    if (result.data.data.enableLPNField === true) {
                        setIsInvalidVCode({
                            invalid: false,
                            message: ""
                        })
                    }
                    else {
                        setIsInvalidVCode({
                            invalid: true,
                            message: ""
                        })
                    }

                }
                else {
                    setIsInvalidVCode({
                        invalid: true,
                        message: result.data.message
                    })
                }
            }
        } catch (error) {
            addToast("Error occurred in validating validation code!", {
                appearance: "error"
            })
        }
    }

    const setLocationTo = (location) => {
        formik.setFieldValue("putawayLocation", location.locationId)
    };

    return (
        <Box mb={2}>
            <LocationSelectorDialog
                open={showLocationSelector}
                handleClose={() => setShowLocationSelector(false)}
                LPN={formik.values.putawayLocation}
                setSelectedLocation={setLocationTo}
                locationType="ALL"
            />
            <Grid container spacing={3}>
                <Grid item md>
                    <CentralizedTextField
                        id="documentNo"
                        name="documentNo"
                        label="Document #"
                        value={formik.values.documentNo}
                        disabled
                    />
                </Grid>
                <Grid item md>
                    <CentralizedTextField
                        id="currentLPN"
                        name="currentLPN"
                        label="Current LPN"
                        // value={formik.values.currentLPN}
                        // onChange={formik.handleChange}
                        onKeyDown={(e) => e.key === 'Enter' && formik.setFieldValue("currentLPN", e.target.value)}
                        required
                        autoFocus
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item md>
                    <CentralizedTextField
                        id="putawayLocation"
                        name="putawayLocation"
                        label="Putaway Location"
                        helperText={isInvalidVCode.message}
                        error={isInvalidVCode.invalid}
                        value={formik.values.putawayLocation}
                        onChange={formik.handleChange}
                        onKeyDown={(e) => e.key === 'Enter' && defineLocationValidationCode()}
                        // onKeyDown={(e) => e.key === 'Enter' && setShowLocationSelector(true)}
                        // onClick={() => setShowLocationSelector(true)}
                        disabled={formik.values.currentLPN.length === 0}
                        required
                    />
                </Grid>
                <Grid item md>
                    <CentralizedTextField
                        id="lpnTo"
                        name="lpnTo"
                        label="LPN"
                        value={formik.values.lpnTo}
                        disabled
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

function StepperForm(props) {
    const { itemInfo, onClose } = props;

    const classes = useStepperStyles();
    const { addToast } = useToasts();

    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [lpnDetails, setLPNDetails] = useState([]);

    const formik = useFormik({
        initialValues: {
            documentNo: itemInfo.documentNo,
            currentLPN: "",

            // below is for location validation code query
            validationCode: "",
            locationId: "",
            locationName: "",
            isEmpty: "",
            lpnTo: "",
            enableLPNField: false,
            occupantQty: 0, //total quantity nga po yan nung mga product na under nung specific LPN

            putawayLocationId: "",
            putawayLocation: "",
            putawayLPN: "",
        },
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: (values) => {
            putawayLPN(values)
        },
    });

    const dataFormatter = (obj) => {
        return {
            contents: [
                ...lpnDetails
            ],
            putawayLocation: obj.locationId,
            userAccountId: sessUser
        }
    };

    const putawayLPN = async (values) => {
        const finalValues = dataFormatter(values)

        setIsSaving(true);

        if (formik.values.locationId.length === 0) {
            setErrorMsg("Please provide location's validation code on Putaway Location field")
        }
        else {
            try {
                const result = await putawayAPI().commitLPNPutaway(finalValues);
                if (result.status === 200) {
                    if (result.data.code === 1) {
                        addToast("Item successfully putaway!", {
                            appearance: "success"
                        });
                        onClose();
                    }
                    else {
                        setErrorMsg("Putaway Error: " + result.data.message)
                        setIsSaving(false);
                    }
                }
            } catch (error) {
                setErrorMsg("Putaway Error: " + error)
                setIsSaving(false);
            }
        }

    };

    return (
        <form onSubmit={(event) => { event.preventDefault(); formik.handleSubmit(event) }}>
            <DialogContent dividers>
                <div className={classes.root}>
                    <PutawayInfo formik={formik} />
                    <LPNPutawayItemsTable palletId={formik.values.currentLPN} setLPNDetails={setLPNDetails} />
                    <Box py={2} hidden={errorMsg.length === 0}>
                        <Alert variant="standard" severity="error">
                            {errorMsg}
                        </Alert>
                    </Box>
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" type="submit" disabled={isSaving || formik.values.locationId === ""}>
                    {isSaving ? (
                        <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                        />
                    ) : (
                        "Save"
                    )}
                </Button>
            </DialogActions>
        </form>

    );
}

const MemoizedStepperForm = React.memo(StepperForm, (prevProps, nextProps) => {
    if (prevProps.itemInfo === nextProps.itemInfo) {
        return true;
    }
    return false;
})
