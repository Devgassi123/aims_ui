import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useToasts } from "react-toast-notifications";

import { makeStyles } from "@material-ui/core/styles";
import { 
    Card, CardContent, CardHeader, Collapse,
    FormControl, FormLabel, FormControlLabel,
    Radio, RadioGroup,
    TextField,
    MenuItem,
} from '@material-ui/core';

import { useCustomStyle } from "../../../../Functions/CustomStyle";
// COMPONENTS
import ZonesActions from "./ZonesActions";
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    cardContent: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
        height: "100%",
        minHeight: 637,
        maxHeight: 637,
        overflow: "auto"
    },
    cardAction: {
        justifyContent: 'flex-end',
        "& > *": {
            width: "25%"
        }
    },
    hidden: {
        display: "none"
    },
    unecessaryFields: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
    }
}));

const initialZonesData = {
    zoneID: 0,
    branchID: 0,
    warehouseID: null,
    areaID: null,
    zoneName: null,
    dateCreated: new Date(),
    dateModified: new Date(),
    createdBy: null,
    modifiedBy: null,
    inactive: 0,
    remarks: null
};

function Form(props) {
    const { selectedRow, setRowSelected } = props;
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const zonesReducer = useSelector(state => state.zonesReducer);

    const [hideUneccessaryFields, setHideUneccessaryFields] = useState(true);
    const [disableNew, setDisableNew] = useState(false);
    const [zonesDetails, setZoneDetails] = useState({...initialZonesData});

    useEffect(() => {
        if(zonesReducer.zone_details !== null) {
            setZoneDetails({...zonesReducer.zone_details})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(selectedRow.length > 0) {
            setHideUneccessaryFields(false);
            setDisableNew(true);
            if(zonesReducer.zone_details === null) {
                setZoneDetails({...initialZonesData});
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRow]);

    const handleClickNew = () => {
        setDisableNew(true);
        setHideUneccessaryFields(true);
        setZoneDetails({...initialZonesData});
    };

    const handClickSave = () => {
        setRowSelected([]);
        setHideUneccessaryFields(true);
        setDisableNew(false);
        setZoneDetails({...initialZonesData});
    };

    const handleClickCancel = () => {
        setRowSelected([]);
        setDisableNew(false);
        setHideUneccessaryFields(true);
        setZoneDetails({...initialZonesData});
        addToast("Transaction Cancelled", {
            appearance: "info",
        });
    };

    const handleOnChangeDetails = (event) => {
        const { name, value } = event.target
        const data = zonesDetails;

        switch (name) {
            case "zoneName":
                data.zoneName = value.slice(0, 100);
                break;
            case "remarks":
                data.remarks = value.slice(0, 500);
                break;
            case "areaID":
            case "inactive":
                data[name] = Number(value);
                break;
            default:
                break;
        }

        setZoneDetails({...data});
    };

    return (
        <Card>
            <CardHeader title="Details" className={customStyle.cardHdr} />
            <form >
                <ZonesActions isDisabled={disableNew} handleClickNew={handleClickNew} handleClickCancel={handleClickCancel} handClickSave={handClickSave} />
                <CardContent className={classes.cardContent}>
                    <TextField 
                        id="zoneID"
                        name="zoneID"
                        label="Zone ID"
                        variant="outlined"
                        size="small"
                        value={zonesDetails.zoneID || ""}
                        fullWidth
                        disabled
                    />
                    <TextField 
                        id="branchID"
                        name="branchID"
                        label="Branch ID"
                        variant="outlined"
                        size="small"
                        value={zonesDetails.branchID || ""}
                        fullWidth
                        disabled
                    />
                    <TextField 
                        id="warehouseID"
                        label="Warehouse ID"
                        variant="outlined"
                        size="small"
                        value={zonesDetails.warehouseID || ""}
                        fullWidth
                        disabled
                    />
                    <TextField 
                        id="areaID"
                        name="areaID"
                        label="Area"
                        select
                        variant="outlined"
                        size="small"
                        value={zonesDetails.areaID || ""}
                        onChange={handleOnChangeDetails}
                        fullWidth
                        required
                    >
                        <MenuItem value={0}>Select Area</MenuItem>
                    </TextField>
                    <TextField 
                        id="zoneName"
                        name="zoneName"
                        label="Zone Name"
                        variant="outlined"
                        size="small"
                        value={zonesDetails.zoneName || ""}
                        onChange={handleOnChangeDetails}
                        fullWidth
                        required
                    />
                    <Collapse in={!hideUneccessaryFields}>
                        <div className={classes.unecessaryFields}>
                            <TextField 
                                id="dateCreated"
                                label="Date Created"
                                variant="outlined"
                                type="datetime-local"
                                size="small"
                                value={moment(zonesDetails.dateCreated).format('YYYY-MM-DDTHH:mm')}
                                fullWidth
                                disabled
                            />
                            <TextField 
                                id="createdBy"
                                label="Created By"
                                variant="outlined"
                                size="small"
                                value={zonesDetails.createdBy || ""}
                                fullWidth
                                disabled
                            />
                            <TextField 
                                id="dateModified"
                                label="Date Modified"
                                variant="outlined"
                                type="datetime-local"
                                size="small"
                                value={moment(zonesDetails.dateModified).format('YYYY-MM-DDTHH:mm')}
                                fullWidth
                                disabled
                            />
                            <TextField 
                                id="modifiedBy"
                                label="Modified By"
                                variant="outlined"
                                size="small"
                                value={zonesDetails.modifiedBy || ""}
                                fullWidth
                                disabled
                            />
                        </div>
                    </Collapse>
                    <TextField 
                        id="remarks"
                        name="remarks"
                        label="Remarks"
                        variant="outlined"
                        size="small"
                        rows={3}
                        value={zonesDetails.remarks || ""}
                        onChange={handleOnChangeDetails}
                        multiline
                        fullWidth
                    />
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Inactive</FormLabel>
                        <RadioGroup row aria-label="inactive" name="inactive" value={zonesDetails.inactive} onChange={handleOnChangeDetails}>
                            <FormControlLabel value={1} control={<Radio color="secondary" />} label="True" />
                            <FormControlLabel value={0} control={<Radio color="secondary" />} label="False" />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </form>
        </Card>
    );
};

Form.propTypes = {
    selectedRow: PropTypes.array.isRequired,
    setRowSelected: PropTypes.func.isRequired,
};

export const ZonesForm = React.memo(Form, (prevProps, nextProps) => {
    if(prevProps.selectedRow === nextProps.selectedRow) {
        return true;
    }
    return false;
});