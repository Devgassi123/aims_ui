import React, { useEffect, useState } from 'react';
import moment from 'moment';
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

import { useToasts } from 'react-toast-notifications';

import { locationAPI, putawayAPI } from '../../../../../redux/api/api';

import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import LocationSelectorDialog from '../../../../LocationSelector/LocationSelector';
import { Alert } from '@material-ui/lab';
import { sessUser } from '../../../../Utils/SessionStorageItems';

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

export default function Putaway(props) {
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
                maxWidth="sm"
                fullWidth
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        onClose()
                    }
                }}
            >
                <DialogTitle id="customized-dialog-title" onClose={onClose}>
                    Item Putaway
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
        message: "Provide the location's validation code."
    })

    const defineLocationValidationCode = async () => {
        
        formik.setFieldValue("locationId", "")
        formik.setFieldValue("enableLPNField", false)

        if(formik.values.putawayLocation.length === 0) {
            setIsInvalidVCode({
                invalid: true,
                message: "Provide location's validation code."
            })

            return;
        }

        try {
            const result = await locationAPI().getLocByValidationCode(formik.values.putawayLocation)
            if (result.status === 200) {
                if (result.data.code === 1) {
                    formik.setValues({ ...formik.values, ...result.data.data })
                    formik.setFieldValue("putawayLocation", result.data.data.locationName)
                    setIsInvalidVCode({
                        invalid: false,
                        message: ""
                    })
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
        <React.Fragment>
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
                        id="targetTrackId"
                        name="targetTrackId"
                        label="Track ID"
                        value={formik.values.targetTrackId}
                        disabled
                    />
                </Grid>
                <Grid item md>
                    <CentralizedTextField
                        id="sku"
                        name="sku"
                        label="SKU"
                        value={formik.values.sku}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item md>
                    <CentralizedTextField
                        id="productName"
                        name="productName"
                        label="Product Name"
                        value={formik.values.productName}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item md>
                    <CentralizedTextField
                        id="uomDisplay"
                        name="uomDisplay"
                        label="UOM"
                        value={formik.values.uomDisplay}
                        disabled
                    />
                </Grid>
                <Grid item md>
                    <CentralizedTextField
                        id="currentQty"
                        name="currentQty"
                        label="Current Qty"
                        value={formik.values.currentQty}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item md>
                    <CentralizedTextField
                        id="currentLocation"
                        name="currentLocation"
                        label="Current Location"
                        value={formik.values.currentLocation}
                        disabled
                    />
                </Grid>
                <Grid item md>
                    <CentralizedTextField
                        id="currentLPN"
                        name="currentLPN"
                        label="Current LPN"
                        value={formik.values.currentLPN}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item md>
                    <CentralizedTextField
                        id="manufactureDate"
                        name="manufactureDate"
                        label="Manufacture Date"
                        value={moment(formik.values.manufactureDate).format("MM-DD-YYYY")}
                        disabled
                    />
                </Grid>
                <Grid item md>
                    <CentralizedTextField
                        id="expiryDate"
                        name="expiryDate"
                        label="Expiry Date"
                        value={moment(formik.values.expiryDate).format("MM-DD-YYYY")}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item md>
                    <CentralizedTextField
                        id="warehousingDate"
                        name="warehousingDate"
                        label="Warehousing Date"
                        value={moment(formik.values.warehousingDate).format("MM-DD-YYYY")}
                        disabled
                    />
                </Grid>
                <Grid item md>
                    <CentralizedTextField
                        id="productConditionId"
                        name="productConditionId"
                        label="Product Condition"
                        value={formik.values.productConditionId}
                        disabled
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
                        disabled={formik.values.targetTrackId === ""}
                        autoFocus
                        required
                    />
                </Grid>
                <Grid item md>
                    <CentralizedTextField
                        id="putawayLPN"
                        name="putawayLPN"
                        label="Putaway LPN"
                        value={formik.values.putawayLPN}
                        onChange={formik.handleChange}
                        disabled={!formik.values.enableLPNField}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

function StepperForm(props) {
    const { itemInfo, onClose } = props;

    const classes = useStepperStyles();
    const { addToast } = useToasts();

    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const formik = useFormik({
        initialValues: {
            poId: itemInfo.poId,
            poLineId: itemInfo.poLineId,
            targetTrackId: "",
            sku: "",
            uomDisplay: "",
            barcode: "",
            barcode2: "",
            barcode3: "",
            barcode4: "",
            productName: "",
            currentQty: "",
            currentLocation: "",
            currentLPN: "",
            manufactureDate: "",
            expiryDate: "",
            warehousingDate: "",
            productConditionId: "",

            validationCode: "",
            locationId: "",
            locationName: "",
            isEmpty: "",
            lpnTo: "",
            enableLPNField: false,
            occupantQty: 0, //total quantity nga po yan nung mga product na under nung specific LPN

            putawayQty: 0,
            putawayLocation: "",
            putawayLPN: "",
        },
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: (values) => {
            putawayItem(values)
        },
    });

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const result = await putawayAPI().getTrackIdDetails(itemInfo.trackIdTo)
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        addToast(result.data.message, {
                            appearance: "error"
                        });
                    }
                    else {
                        if (isMounted) formik.setValues({ ...formik.values, ...result.data.data.putawayWinOne })
                    }
                }
            } catch (error) {
                addToast("Get Track ID Details Error:" + error, {
                    appearance: "error"
                })
            }
        })()

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [itemInfo])

    const dataFormatter = (obj) => {
        return {
            putawayWinOne: {
                targetTrackId: obj.targetTrackId,
                sku: obj.sku,
                barcode: obj.barcode,
                barcode2: obj.barcode2,
                barcode3: obj.barcode3,
                barcode4: obj.barcode4,
                productName: obj.productName,
                currentQty: Number(obj.currentQty),
                currentLocation: obj.currentLocation,
                currentLPN: obj.currentLPN,
                manufactureDate: obj.manufactureDate === null ? null : moment(obj.manufactureDate).format("YYYY-MM-DD"),
                expiryDate: obj.expiryDate === null ? null : moment(obj.expiryDate).format("YYYY-MM-DD"),
                warehousingDate: moment(obj.warehousingDate).format("YYYY-MM-DD"),
                productConditionId: obj.productConditionId,
                uomDisplay: obj.uomDisplay
            },
            putawayWinTwo: {
                putawayQty: Number(obj.currentQty),
                putawayLocation: obj.locationId,
                putawayLPN: obj.putawayLPN
            },
            userAccountId: sessUser
        }
    };

    const putawayItem = async (values) => {
        const finalValues = dataFormatter(values)

        setIsSaving(true);

        if (formik.values.locationId.length === 0) {
            setErrorMsg("Please provide location's validation code on Putaway Location field")
        }
        else {
            try {
                const result = await putawayAPI().commitPutaway(finalValues);
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
                    <Box py={2} hidden={errorMsg.length === 0}>
                        <Alert variant="standard" severity="error">
                            {errorMsg}
                        </Alert>
                    </Box>
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" type="submit" disabled={isSaving}>
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
