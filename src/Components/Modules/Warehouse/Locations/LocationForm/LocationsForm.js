import React, { useEffect, useState } from 'react';
import serialize from 'form-serialize';
import PropTypes from 'prop-types';
import { useToasts } from "react-toast-notifications";
import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    Grid
} from '@material-ui/core';
import swal from 'sweetalert';
import moment from 'moment';

import { useCustomStyle } from "../../../../../Functions/CustomStyle";
// API
import { locationAPI } from '../../../../../redux/api/api';
// FUNCTIONS
import { populateFields } from '../../../../../Functions/Util';
// COMPONENTS
import LocationsAction from "./LocationsAction";
import { BasicInfoForm } from "./BasicInfo";
import { PositionForm } from "./Position";
import { BackdropLoad } from '../../../../Layout/Loader';
import { sessUser } from '../../../../Utils/SessionStorageItems';

// const sessUser = JSON.parse(sessionStorage.getItem("user"));

const useStyles = makeStyles((theme) => ({
    cardContent: {
        height: "100%",
        minHeight: 637,
        maxHeight: 637,
        overflow: "auto"
    },
    fields: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
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

var initialLocationData = {
    locationId: "",
    locationName: "",
    description: "",
    locationTypeId: "",
    locationGroupId: "",
    areaId: "",
    inactive: 0,
    validationCode: null,
    aisleCode: null,
    bayCode: null,
    dateCreated: "",
    dateModified: "",
    createdBy: "",
    modifiedBy: ""
};

function Form(props) {
    const { selectedLocation, setSelectedLocation, setReload, userAllowedActions } = props;
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const [disableActions, setDisableActions] = useState(true);
    const [locationInfo, setLocationInfo] = useState({ ...initialLocationData });
    const [clearValue, setClearVal] = useState(false); //for elements that can't be reset (e.g. select & radio)
    const [showBackdrop, setShowBackdrop] = useState(false);

    useEffect(() => {
        let timeout;

        if (clearValue === true) {
            timeout = setTimeout(() => {
                setClearVal(false)
            }, 1000);

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [clearValue])

    useEffect(() => {
        if (selectedLocation.length !== 0) {
            setDisableActions(false);
            getLocationDetails();
        }
        else {
            var form = document.querySelector("#formLocation");
            form.reset();
            setLocationInfo({ ...initialLocationData });
            setClearVal(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLocation]);

    const getLocationDetails = async () => {
        setShowBackdrop(true);
        try {
            const result = await locationAPI().getbyid(selectedLocation);
            if (result.status === 200) {
                populateFields(result.data.data)
                setLocationInfo(result.data.data)
                setShowBackdrop(false);
            }
        } catch (error) {
            setShowBackdrop(false);
            addToast("Error occurred in getting location details!", {
                apperance: "error"
            });
        }
    };

    const dataFormatter = async (obj) => {
        return {
            ...obj,
            locationId: String(obj.locationId.replace(/[^a-zA-Z0-9-_]/g, '')).toUpperCase(),
            areaId: obj.areaId === "" ? null : obj.areaId,
            description: obj.description === "" ? null : obj.description,
            validationCode: obj.validationCode === "" ? null : obj.validationCode,
            aisleCode: obj.aisleCode === "" ? null : obj.aisleCode,
            bayCode: obj.bayCode === "" ? null : obj.bayCode,
            inactive: Number(obj.inactive),
            createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
            modifiedBy: sessUser,
            dateCreated:  obj.createdBy === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated).format("YYYY-MM-DDTHH:mm"),
            dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm")
        }
    };

    const handleClickNew = () => {
        // var form = document.querySelector("#formLocation");
        // form.reset();
        // setLocationInfo({ ...initialLocationData });
        // setClearVal(true);
        setSelectedLocation([]); //no need the above commented code. This will trigger the same code in useEffect.
    };

    const handleClickDelete = () => {
        if(!userAllowedActions[0].actions.includes("DEL")){
            addToast("You are not allowed to use delete action.", {
                appearance: "error",
            });
            return;
        }

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this location!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                setDisableActions(true);
                try {
                    const result = await locationAPI().delete(selectedLocation);
                    if(result.status === 200) {
                        if(result.data.code === 0) {
                            addToast(result.data.message, {
                                appearance: "error",
                            });
                        }
                        else {
                            setReload(true);
                            handleClickNew();
                            addToast("Deleted successfully", {
                                appearance: "success",
                            });
                        }
                    }
                } catch (error) {
                    addToast("Error occurred in deleting the location", {
                        appearance: "error",
                    });
                }
            }
        });
    };

    const handClickSave = async (event) => {
        event.preventDefault();

        setDisableActions(true);
        setShowBackdrop(true);

        var form = event.currentTarget;
        var serializedForm = serialize(form, { hash: true, empty: true, disabled: true });
        var finalValues = await dataFormatter(serializedForm);

        if(String(finalValues.locationId).replace(/\s/g, '').replace(/-/g, '').replace(/_/g, '').length === 0) {
            addToast("Invalid Location ID.", {
                appearance: "error",
            });
            setShowBackdrop(false);
            return;
        }

        try {
            let result;
            if(selectedLocation.length > 0) {
                if(!userAllowedActions[0].actions.includes("MOD")){
                    addToast("You are not allowed to use update action.", {
                        appearance: "error",
                    });
                    setShowBackdrop(false);
                    setDisableActions(false);
                    return;
                }

                result = await locationAPI().update(finalValues)
            }
            else {
                if(!userAllowedActions[0].actions.includes("ADD")){
                    addToast("You are not allowed to use add action.", {
                        appearance: "error",
                    });
                    setShowBackdrop(false);
                    setDisableActions(false);
                    return;
                }

                result = await locationAPI().create(finalValues)
            }

            if(result.status === 200) {
                setShowBackdrop(false);
                if(result.data.code === 0) {
                    setDisableActions(false);
                    addToast(result.data.message, {
                        appearance: "error"
                    })
                }
                else {
                    setReload(true)
                    handleClickNew()
                    addToast("Saved successfully!", {
                        appearance: "success"
                    })
                }
            }
        } catch (error) {
            setShowBackdrop(false);
            setDisableActions(false);
            addToast("Error occurred in saving the details!", {
                appearance: "error"
            })
        }
    };

    const handleClickCancel = () => {
        if(selectedLocation.length > 0) {
            getLocationDetails();
        }
        else {
            var form = document.querySelector("#formLocation");
            form.reset();
            setLocationInfo({ ...initialLocationData });
            setClearVal(true);
        }
        setDisableActions(true);
        // get again the details of location
        addToast("Transaction Cancelled", {
            appearance: "info",
        });
    };

    return ( 
        <React.Fragment>
            <BackdropLoad show={showBackdrop} />
            <Card>
                <CardHeader title="Details" className={customStyle.cardHdr} />
                <form id="formLocation" onSubmit={handClickSave}>
                    <LocationsAction
                        isDisabled={disableActions}
                        isDisableDelete={selectedLocation.length === 0}
                        handleClickNew={handleClickNew}
                        handleClickDelete={handleClickDelete}
                        handleClickCancel={handleClickCancel}
                    />
                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={3}>
                            <Grid item sm={12} md={6} lg={6} className={classes.fields}>
                                <BasicInfoForm
                                    basicInfo={locationInfo}
                                    setBasicInfo={setLocationInfo}
                                    setDisableActions={setDisableActions}
                                    clearValue={clearValue}
                                    setClearValue={setClearVal}
                                />
                            </Grid>
                            <Grid item sm={12} md={6} lg={6} className={classes.fields}>
                                <PositionForm
                                    positionInfo={locationInfo}
                                    setPositionInfo={setLocationInfo}
                                    setDisableActions={setDisableActions}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </form>
            </Card>
        </React.Fragment>
    );
};

Form.propTypes = {
    selectedLocation: PropTypes.any.isRequired,
    setSelectedLocation: PropTypes.func.isRequired,
    userAllowedActions: PropTypes.array.isRequired
};

export const LocationsForm = React.memo(Form, (prevProps, nextProps) => {
    if (prevProps.selectedLocation === nextProps.selectedLocation) {
        return true;
    }
    return false;
});