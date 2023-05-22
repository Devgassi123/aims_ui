import React, { useState } from 'react';
import serialize from 'form-serialize';
import moment from 'moment';
import { useFormik } from 'formik';
import { useToasts } from 'react-toast-notifications';
//MATERIAL UI
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Box, Button,
    CircularProgress,
    Dialog, DialogActions as MuiDialogActions, DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    Step, Stepper, StepLabel,
    Typography,
    MenuItem,
    InputAdornment
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { 
    Close as CloseIcon,
    ListAlt as ListAltIcon
} from '@material-ui/icons';
//CHILD COMPONENTS
import CentralizedTextField from '../../../Inputs/CentralizedTextField/CentralizedTextField';
import { ProductConditionOptionBox } from '../../../ReferenceOptionBox/ReferenceOptionBox';
import LocationSelectorDialog from '../../../LocationSelector/LocationSelector';
import CentralizedRadioGrp from '../../../Inputs/CentralizedRadioGrp/CentralizedRadioGrp';
import { ReceivingSerialNosTable } from './ReceivingSerialNosTable';
//API
import {
    labelaryAPI,
    localPrinterAPI,
    locationAPI,
    receivingAPI,
    returnsReceivingAPI,
    whTransferReceivingAPI
} from '../../../../redux/api/api';
//UTILD
import { sessUser } from '../../../Utils/SessionStorageItems';
import CentralizedSelectBox from '../../../Inputs/CentralizedSelectBox/CentalizedSelectBox';

var zplToPrint = "";

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

export default function Receiving(props) {
    const { open, onClose, itemInfo } = props;

    if (!open) {
        return null;
    }

    return (
        <div>
            <Dialog
                open={open}
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
                    Item Receiving
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

function getSteps() {
    return ['Receive Info', 'Location', 'Lot Attributes', 'Serial Nos', 'Retagging'];
}

// eslint-disable-next-line 
function getStepContent(stepIndex, formik, labelsToPrint, zplDetails, serialNos, setSerialNos) {
    switch (stepIndex) {
        case 0:
            return <ReceiveInfo formik={formik} />
        case 1:
            return <LocationInfo formik={formik} />
        case 2:
            return <LotAttInfo formik={formik} />
        case 3:
            return <SerialNos serialNos={serialNos} setSerialNos={setSerialNos} />
        case 4:
            return <Retagging labelsToPrint={labelsToPrint} zplDetails={zplDetails} />
        default:
            return 'Unknown stepIndex';
    }
}

function ReceiveInfo(props) {
    const { formik } = props;

    const defineFieldsOfDoc = () => {
        if (formik.values.hasOwnProperty('poId')) {
            return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm>
                        <CentralizedTextField
                            id="poId"
                            name="poId"
                            label="PO #"
                            value={formik.values.poId}
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item sm>
                        <CentralizedTextField
                            id="poLineId"
                            name="poLineId"
                            label="Order Line ID"
                            value={formik.values.poLineId}
                            fullWidth
                            disabled
                        />
                    </Grid>
                </Grid>
            )
        }
        else if (formik.values.hasOwnProperty('returnsId')) {
            return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm>
                        <CentralizedTextField
                            id="returnsId"
                            name="returnsId"
                            label="Returns #"
                            value={formik.values.returnsId}
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item sm>
                        <CentralizedTextField
                            id="returnsLineId"
                            name="returnsLineId"
                            label="Returns Line ID"
                            value={formik.values.returnsLineId}
                            fullWidth
                            disabled
                        />
                    </Grid>
                </Grid>
            )
        }
        else if (formik.values.hasOwnProperty('whTransferId')) {
            return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm>
                        <CentralizedTextField
                            id="whTransferId"
                            name="whTransferId"
                            label="WH Transfer #"
                            value={formik.values.whTransferId}
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item sm>
                        <CentralizedTextField
                            id="whTransferLineId"
                            name="whTransferLineId"
                            label="Item Line ID"
                            value={formik.values.whTransferLineId}
                            fullWidth
                            disabled
                        />
                    </Grid>
                </Grid>
            )
        }
    }

    return (
        <React.Fragment>
            {defineFieldsOfDoc()}
            <Grid container spacing={3}>
                <Grid item xs={12} sm>
                    <CentralizedTextField
                        id="sku"
                        name="sku"
                        label="SKU"
                        value={formik.values.sku}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <Box display="flex">
                        <CentralizedTextField
                            id="qtyToReceive"
                            name="qtyToReceive"
                            label="Qty To Receive"
                            value={formik.values.qtyToReceive}
                            onChange={formik.handleChange}
                            onBlur={(event) => formik.setFieldValue("qtyTo", event.target.value)}
                            type="number"
                            autoFocus
                            required
                        />
                        <Box flexGrow="1" ml={1}>
                            <CentralizedTextField
                                id="uomDisplay"
                                name="uomDisplay"
                                label="UOM"
                                value={formik.values.uomDisplay}
                                disabled
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

function LocationInfo(props) {
    const { formik } = props;

    const [showLocationSelector, setShowLocationSelector] = useState(false);
    const [isInvalidVCode, setIsInvalidVCode] = useState({
        invalid: false,
        message: ""
    })

    const setLocationTo = (location) => {
        formik.setFieldValue("locationTo", location.locationId)
        setIsInvalidVCode({
            invalid: false,
            message: ""
        })
    };

    const defineLocationValidationCode = async () => {

        if(formik.values.locationTo.length === 0) {
            setIsInvalidVCode({
                invalid: true,
                message: "Provide location's validation code."
            })

            return;
        }

        try {
            const result = await locationAPI().getLocByValidationCode(formik.values.locationTo)
            if (result.status === 200) {
                if (result.data.code === 1) {
                    formik.setValues({ ...formik.values, ...result.data.data })
                    formik.setFieldValue("locationTo", result.data.data.locationName)
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
            setIsInvalidVCode({
                invalid: true,
                message: "Error occurred in validating validation code!"
            })
        }
    }

    return (
        <React.Fragment>
            <LocationSelectorDialog
                open={showLocationSelector}
                handleClose={() => setShowLocationSelector(false)}
                setSelectedLocation={setLocationTo}
                locationType="INSTAGING"
            />
            <Grid container spacing={3}>
                <Grid item xs={12} sm>
                    <CentralizedTextField
                        id="qtyTo"
                        name="qtyTo"
                        label="Received Qty."
                        value={formik.values.qtyTo}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <CentralizedTextField
                        id="locationTo"
                        name="locationTo"
                        label="Receiving Location"
                        helperText={isInvalidVCode.message}
                        error={isInvalidVCode.invalid}
                        value={formik.values.locationTo}
                        onChange={formik.handleChange}
                        onKeyDown={(e) => e.key === 'Enter' && defineLocationValidationCode()}
                        InputProps={{
                            endAdornment: 
                                <InputAdornment position="end">
                                    <IconButton edge='end' onClick={() => setShowLocationSelector(true)}>
                                        <ListAltIcon />
                                    </IconButton>
                                </InputAdornment>
                        }}
                        autoFocus
                        required
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} sm>
                    <CentralizedTextField
                        id="lpnTo"
                        name="lpnTo"
                        label="LPN"
                        helperText="Input `*` to let system generate the LPN"
                        value={formik.values.lpnTo}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <CentralizedTextField
                        id="trackIdTo"
                        name="trackIdTo"
                        label="Track ID"
                        helperText="Input `*` to let system generate the ID"
                        value={formik.values.trackIdTo}
                        onChange={formik.handleChange}
                        required
                    />
                </Grid>
            </Grid>
            <CentralizedTextField
                id="remarks"
                name="remarks"
                label="Remarks"
                value={formik.values.remarks}
                onChange={formik.handleChange}
            />
        </React.Fragment>
    )
}

function LotAttInfo(props) {
    const { formik } = props;

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} sm>
                    <CentralizedTextField
                        id="manufactureDate"
                        name="manufactureDate"
                        label="Manufacturing Date"
                        type="date"
                        value={formik.values.manufactureDate}
                        onChange={formik.handleChange}
                    // required
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <CentralizedTextField
                        id="expiryDate"
                        name="expiryDate"
                        label="Expiration Date"
                        type="date"
                        value={formik.values.expiryDate}
                        onChange={formik.handleChange}
                    // required
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} sm>
                    <CentralizedTextField
                        id="warehousingDate"
                        name="warehousingDate"
                        label="Warehousing Date"
                        type="date"
                        value={formik.values.warehousingDate}
                        onChange={formik.handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm>
                    <ProductConditionOptionBox
                        id="productConditionId"
                        name="productConditionId"
                        label="Product Condition"
                        margin="dense"
                        value={formik.values.productConditionId}
                        onChange={formik.handleChange}
                        required
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

function SerialNos(props) {
    const { serialNos, setSerialNos } = props;

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = document.querySelector("#formSerialCatch")
        const serializedForm = serialize(form, { empty: true, disabled: true, hash: true })

        form.reset();

        setSerialNos(serialNos.concat({
            ...serializedForm,
            dateCreated: moment(new Date()).format("YYYY-MM-DD"),
            createdBy: sessUser,
        }));
    }

    return (
        <React.Fragment>
            <Alert variant="standard" severity="info">
                Note: You can skip this if not required to get the serial number of each SKU. <br />
                Do not leave this form if you've started to input the serial no. Doing so will result to re-catch the serial numbers.
            </Alert>
            <form id="formSerialCatch" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm>
                        <CentralizedTextField
                            id="tagId"
                            name="tagId"
                            label="Tag ID"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <CentralizedTextField
                            id="epc"
                            name="epc"
                            label="EPC"
                            inputProps={{
                                maxLength: 12
                            }}
                            required
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm>
                        <CentralizedTextField
                            id="serialno"
                            name="serialno"
                            label="Serial #"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <CentralizedTextField
                            id="remarks"
                            name="remarks"
                            label="Remarks"
                        />
                    </Grid>
                </Grid>
                <Button
                    id="btnAddSerialNo"
                    variant='contained'
                    color='primary'
                    type="submit"
                    style={{
                        float: "right"
                    }}
                >
                    Submit
                </Button>
            </form>
            <ReceivingSerialNosTable serialNos={serialNos} />
        </React.Fragment>
    )
}

function Retagging(props) {
    const { labelsToPrint, zplDetails } = props;

    const [preview, setPreview] = useState(null);
    const [isVisibleSN, setIsVisibleSN] = useState(false);

    const previewTag = async (event) => {
        try {

            if (event.target.value === "EPC") {
                setIsVisibleSN(true);
                return;
            }

            setIsVisibleSN(false);

            // const result = await labelaryAPI().convert(zplDetails[0].zplLines)
            zplToPrint = zplDetails.filter(zpl => zpl.docTypeId === event.target.value);
            const zpl = zplDetails.filter(zpl => zpl.docTypeId === event.target.value && zpl.dpiSizeId.includes("300"))
            const result = await labelaryAPI(undefined, zpl[0].zplName.slice(-3)).convert(zpl[0].zplLines)
            if (result.status === 200) {
                const imgBlob = new Blob([result.data]);
                const imgURL = URL.createObjectURL(imgBlob)
                setPreview(imgURL);
            }
        } catch (error) {
            console.log("LABELARY API: ", error)
        }
    }

    const previewSNTag = async (event) => {

        if (event.target.value === "") {
            return;
        }

        try {
            zplToPrint = zplDetails.filter(zpl => zpl.untouchedEPC === event.target.value);
            const zpl = zplDetails.filter(zpl => zpl.untouchedEPC === event.target.value && zpl.dpiSizeId.includes("300"))
            const result = await labelaryAPI(undefined, zpl[0].zplName.slice(-3)).convert(zpl[0].zplLines)
            if (result.status === 200) {
                const imgBlob = new Blob([result.data]);
                const imgURL = URL.createObjectURL(imgBlob)
                setPreview(imgURL);
            }
        } catch (error) {
            console.log("LABELARY API: ", error)
        }
    }

    const generateLabels2Print = () => {
        const distinctLabels = labelsToPrint.reduce((accumulated, currentElement) => {
            if (!accumulated.some(item => item["docTypeId"] === currentElement["docTypeId"])) {
                accumulated.push(currentElement);
            }
            return accumulated;
        }, []);

        return (
            distinctLabels.map((label, index) =>
                <FormControlLabel key={index} value={label.docTypeId} control={<Radio color="secondary" />} label={label.docTypeId} />
            )
        )
    }

    return (
        <Box padding={1}>
            <Typography variant='h6' align='center' gutterBottom>Receive successful! Do you like to reprint the tag?</Typography>
            <Box px={2} py={3} display="block" width="100%">
                <CentralizedRadioGrp
                    id="tagType"
                    name="tagType"
                    label="Tag Type"
                    // defaultValue={0}
                    // disabled={true}
                    onChange={previewTag}
                // onChange={onChangeDetails}
                >
                    {generateLabels2Print()}
                </CentralizedRadioGrp>
                <Box display={isVisibleSN ? "block" : "none"} mt={3}>
                    <CentralizedSelectBox
                        id="serialList"
                        name="serialList"
                        label="Select EPC"
                        variant="outlined"
                        onChange={previewSNTag}
                    >
                        <MenuItem value={""}>Select EPC</MenuItem>
                        {zplDetails.filter(zpl => zpl.docTypeId === "EPC" && zpl.zplName.includes("300"))
                            .map(serial =>
                                <MenuItem key={serial} value={serial.untouchedEPC}>{serial.untouchedEPC}</MenuItem>
                            )
                        }
                    </CentralizedSelectBox>
                </Box>
                {/* <Typography variant='body' align='center' gutterBottom>Tag value here...</Typography> */}
                {preview === null
                    ? <span>Select tag to load preview of tag.</span>
                    : <img src={preview} alt="Tag Preview" width="100%" height="auto" />}

            </Box>

        </Box>
    )
}

const steps = getSteps();

function StepperForm(props) {
    const { itemInfo } = props;

    const classes = useStepperStyles();
    const { addToast } = useToasts();

    const [activeStep, setActiveStep] = React.useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [skippedRequired, setSkippedRequired] = useState([]);
    const [serialNos, setSerialNos] = useState([]);
    const [labelsToPrint, setLabelsToPrint] = useState([]);
    const [zplDetails, setZPLDetails] = useState([]);
    const [error, setError] = useState({
        isError: false,
        msg: ""
    })

    const formik = useFormik({
        initialValues: {
            // poId: itemInfo.poId,
            // poLineId: itemInfo.poLineId,
            // sku: itemInfo.sku,
            // uomDisplay: itemInfo.uomDisplay,
            ...itemInfo,
            qtyToReceive: itemInfo.qtyToReceived,
            userAccouontId: sessUser,
            qtyTo: 0,
            locationTo: "",
            lpnTo: "",
            trackIdTo: "*",
            remarks: "",
            manufactureDate: "",
            expiryDate: "",
            warehousingDate: "",
            productConditionId: "GOOD"
        },
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: (values) => {
            receiveItem(values)
        },
    });

    const dataFormatter = (obj) => {
        let invHead;

        if("poId" in obj) {
            invHead = {
                poId: obj.poId,
                poLineId: obj.poLineId,
                qtyToReceive: obj.qtyToReceive,
                userAccountId: sessUser
            }
        }
        else if("returnsId" in obj) {
            invHead = {
                returnsId: obj.returnsId,
                returnsLineId: obj.returnsLineId,
                qtyToReceive: obj.qtyToReceive,
                userAccountId: sessUser
            }
        }
        else if("whTransferId" in obj) {
            invHead = {
                whTransferId: obj.whTransferId,
                whTransferLineId: obj.whTransferLineId,
                qtyToReceive: obj.qtyToReceive,
                userAccountId: sessUser
            }
        }

        return {
            invHead,
            invDetail: {
                documentRefId: Object.values(invHead)[0],
                qtyTo: Number(obj.qtyTo),
                locationTo: obj.locationTo,
                lpnTo: obj.lpnTo,
                trackIdTo: obj.trackIdTo,
                remarks: obj.remarks,
                createdBy: sessUser
            },
            lotAtt: {
                manufactureDate: obj.manufactureDate.length === 0 ? null : moment(obj.manufactureDate).format("YYYY-MM-DD"),
                expiryDate: obj.expiryDate.length === 0 ? null : moment(obj.expiryDate).format("YYYY-MM-DD"),
                warehousingDate: obj.warehousingDate.length === 0 ? null : moment(obj.warehousingDate).format("YYYY-MM-DD"),
                productConditionId: obj.productConditionId,
                createdBy: sessUser,
                modifiedBy: sessUser
            },
            uniqTags: serialNos
        }
    };

    const receiveItem = async (values) => {

        const finalValues = dataFormatter(values)

        setIsSaving(true);
        //test
        // if (skippedRequired.length === 0) {
        //     setActiveStep(3)
        // }
        // else {
        //     setActiveStep(skippedRequired[0])
        // }
        // setIsSaving(false);
        //end test

        if (skippedRequired.length === 0) {
            try {
                let result;

                if(formik.values.hasOwnProperty('poId')) {
                    result = await receivingAPI().receive(finalValues);
                }
                else if(formik.values.hasOwnProperty('returnsId')) {
                    result = await returnsReceivingAPI().receive(finalValues);
                }
                else if(formik.values.hasOwnProperty('whTransferId')){
                    result = await whTransferReceivingAPI().receive(finalValues);
                }
                
                if (result.status === 200) {
                    if (result.data.code === 1) {
                        setError({
                            isError: false,
                            msg: ""
                        })
                        setLabelsToPrint(result.data.data.labelsToPrint)
                        setZPLDetails(result.data.data.zplDetails);
                        // autoPrintTags(result.data.data.zplDetails);

                        // uncomment below if autoPrint is commented
                        setIsSaving(false);
                        setActiveStep(4)
                        //end 

                        addToast("Item successfully received!", {
                            appearance: "success"
                        });
                        // onClose();
                    }
                    else {
                        setError({
                            isError: true,
                            msg: result.data.message
                        })
                        setIsSaving(false);
                    }
                }
            } catch (error) {
                setError({
                    isError: true,
                    msg: String(error)
                })
                setIsSaving(false);
            }
        }
        else {
            setActiveStep(skippedRequired[0])
            setIsSaving(false);
        }
    };

    const autoPrintTags = async (zplCodes) => {
        try {
            const result = await localPrinterAPI().print(zplCodes)
            if (result.status === 200) {
                setIsSaving(false);
                setActiveStep(4)
            }
        } catch (error) {
            setError({
                isError: true,
                msg: "Printer Error: " + String(error)
            })
            setIsSaving(false);
        }
    };

    const printTag = () => {
        // console.log("zplToPrint", zplToPrint)
        autoPrintTags(zplToPrint);
    };

    const chkRequiredFields = () => {
        let newSkippedRequired = Array.from(skippedRequired);

        switch (activeStep) {
            case 0:
                if (formik.values.qtyToReceive === "") {
                    if (newSkippedRequired.indexOf(0) === -1) {
                        newSkippedRequired = newSkippedRequired.concat(0);
                    }
                }
                else {
                    newSkippedRequired.splice(newSkippedRequired.indexOf(0), 1)
                }
                break;
            case 1:
                if (formik.values.locationTo === "" || formik.values.trackIdTo === "") {
                    if (newSkippedRequired.indexOf(1) === -1) {
                        newSkippedRequired = newSkippedRequired.concat(1)
                    }
                }
                else {
                    newSkippedRequired.splice(newSkippedRequired.indexOf(1), 1)
                }
                break;
            case 2:
                if (
                    // formik.values.expiryDate === "" || formik.values.manufactureDate === "" || 
                    formik.values.warehousingDate === "" ||
                    formik.values.productConditionId === "") {
                    if (newSkippedRequired.indexOf(2) === -1) {
                        newSkippedRequired = newSkippedRequired.concat(2)
                    }
                }
                else {
                    newSkippedRequired.splice(newSkippedRequired.indexOf(2), 1)
                }
                break;
            default:
                break;
        }

        console.log(formik.values)
        console.log(newSkippedRequired)
        setSkippedRequired(newSkippedRequired);
    };

    const handleNext = () => {
        chkRequiredFields();

        if (activeStep < 3) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <form onSubmit={(event) => { event.preventDefault(); formik.handleSubmit(event) }}>
            <DialogContent dividers>
                <div className={classes.root}>
                    <Stepper activeStep={activeStep} className={classes.stepper} color="secondary" alternativeLabel>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};

                            if (skippedRequired.indexOf(index) !== -1) {
                                stepProps.completed = false;
                                labelProps.error = true;
                            }

                            return (
                                <Step key={label} color="secondary" {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>
                    <div>
                        {/* // <React.Fragment>
                        //     <div hidden={0 !== activeStep}>
                        //         <ReceiveInfo formik={formik} />
                        //     </div>
                        //     <div hidden={1 !== activeStep}>
                        //         <LocationInfo formik={formik} />
                        //     </div>
                        //     <div hidden={2 !== activeStep}>
                        //         <LotAttInfo formik={formik} />
                        //     </div>
                        // </React.Fragment> */}
                        {getStepContent(activeStep, formik, labelsToPrint, zplDetails, serialNos, setSerialNos)}
                    </div>
                    <Box py={2} hidden={!error.isError}>
                        <Alert variant="standard" severity="error">
                            Error Code: {error.msg}
                        </Alert>
                    </Box>
                </div>
            </DialogContent>
            <DialogActions>
                <Box hidden={activeStep > 3}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.backButton}
                    >
                        Back
                    </Button>
                </Box>
                <Box hidden={activeStep > 2}>
                    <Button variant="contained" color="primary" onClick={handleNext}>
                        Next
                    </Button>
                </Box>
                <Box hidden={activeStep < 3 || activeStep === 4}>
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
                </Box>
                <Box hidden={activeStep < 4}>
                    <Button variant="contained" color="primary" disabled={isSaving} onClick={printTag}>
                        {isSaving ? (
                            <CircularProgress
                                size={24}
                                className={classes.buttonProgress}
                            />
                        ) : (
                            "Print"
                        )}
                    </Button>
                </Box>
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
