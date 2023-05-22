import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useToasts } from "react-toast-notifications";

import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    Grid,
} from '@material-ui/core';

import { useCustomStyle } from "../../../../Functions/CustomStyle";
// API
import { areasAPI } from '../../../../redux/api/api';
import { sessUser } from '../../../Utils/SessionStorageItems';
// COMPONENTS
import { BackdropLoad } from '../../../Layout/Loader';
import CentralizedTextField from '../../../Inputs/CentralizedTextField/CentralizedTextField';
import AreasActions from "./AreasActions";

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
    },
    grid: {
        padding: "0px 0px"
    },
    gridItem: {
        "& > *": {
            margin: theme.spacing(.75, 0),
            maxWidth: "98%"
        },
        padding: "0px"
    },
    gridItem2: {
        "& > *": {
            margin: theme.spacing(.75, 0),
            maxWidth: "100%",
        },
        alignContent: "right",
        padding: "0px"
    }
}));

const initialAreasData = {
    areaId: 0,
    areaName: null,
    description: null,
    dateCreated: null,
    dateModified: null,
    createdBy: null,
    modifiedBy: null,
};

function AreasForm(props) {
    const { selectedRow, setSelectedRow, setReload, userAllowedActions } = props;
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const [disableSave, setDisableSave] = useState(true);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [areasDetails, setAreasDetails] = useState({ ...initialAreasData });

    useEffect(() => {
        if (selectedRow.length > 0) {
            getAreaDetails();
        }
        else {
            setAreasDetails({...initialAreasData})
        }
    // eslint-disable-next-line
    }, [selectedRow])

    const getAreaDetails = async () => {
        setShowBackdrop(true);
        try {
            const result = await areasAPI().getbyid(selectedRow[0])
            if(result.status === 200) {
                setShowBackdrop(false);
                if(result.data.code === 0) {
                    addToast("There's problem in getting the details. Please reload this page.", {
                        appearance: "error"
                    })
                }
                else {
                    setAreasDetails({...result.data.data})
                }
            }
        } catch (error) {
            addToast("Error occurred in getting the details!", {
                appearance: "error"
            })
        }
    };

    const handleClickNew = () => {
        setDisableSave(false);
        setSelectedRow([]);
    };

    const handleClickCancel = () => {
        if(selectedRow.length > 0) {
            getAreaDetails()
        }
        else {
            setAreasDetails({ ...initialAreasData });
        }
        setDisableSave(true);
        addToast("Transaction Cancelled", {
            appearance: "info",
        });
    };

    const handleOnChangeDetails = (event) => {
        const { name, value } = event.target
        const data = areasDetails;

        switch (name) {
            case "areaId":
                data.areaId = value.slice(0, 50);
                break;
            case "areaName":
                data.areaName = value.slice(0, 100);
                break;
            case "description":
                data.description = value.slice(0, 200);
                break;
            default:
                break;
        }

        setAreasDetails({ ...data });
        setDisableSave(false);
    };

    const dataFormatter = (obj) => {
        return {
            ...obj,
            areaId: String(obj.areaId.replace(/[^a-zA-Z0-9]/g, '')).toUpperCase(),
            createdBy: obj.createdBy === null ? sessUser : obj.createdBy,
            modifiedBy: sessUser,
            dateCreated: obj.createdBy === null ? moment(new Date()).format("YYYY-MM-DDTHH:MM") : obj.dateCreated,
            dateModified: moment(new Date()).format("YYYY-MM-DDTHH:MM")
        }
    };

    const saveChanges = async (event) => {
        event.preventDefault();

        setShowBackdrop(true);
        setDisableSave(true);

        const finalValues = dataFormatter(areasDetails);

        if(String(finalValues.areaId).replace(/\s/g, '').replace(/-/g, '').replace(/_/g, '').length === 0) {
            addToast("Invalid Area ID.", {
                appearance: "error",
            });
            setShowBackdrop(false);
            return;
        }

        try {
            let result;
            if (selectedRow.length > 0) {
                if(!userAllowedActions[0].actions.includes("MOD")){
                    addToast("You are not allowed to use update action.", {
                        appearance: "error",
                    });
                    setShowBackdrop(false);
                    setDisableSave(false);
                    return;
                }

                result = await areasAPI().update(finalValues)
            }
            else {
                if(!userAllowedActions[0].actions.includes("ADD")){
                    addToast("You are not allowed to use add action.", {
                        appearance: "error",
                    });
                    setShowBackdrop(false);
                    setDisableSave(false);
                    return;
                }

                result = await areasAPI().create(finalValues)
            }

            if (result.status === 200) {
                setShowBackdrop(false);
                if (result.data.code === 0) {
                    setDisableSave(false);
                    addToast(result.data.message, {
                        appearance: "error",
                    });
                }
                else {
                    setSelectedRow([]);
                    setAreasDetails({ ...initialAreasData });
                    setReload(true);
                    addToast("Saved successfully!", {
                        appearance: "success",
                    });
                }
            }
        } catch (error) {
            setShowBackdrop(false);
            addToast("Error occurred in saving details!", {
                appearance: "error",
            });
        }
    };

    return (
        <React.Fragment>
            <BackdropLoad show={showBackdrop} />
            <Card>
                <CardHeader title="Details" className={customStyle.cardHdr} />
                <form onSubmit={saveChanges} >
                    <AreasActions
                        isDisabled={disableSave}
                        handleClickNew={handleClickNew}
                        handleClickCancel={handleClickCancel}
                    />
                    <CardContent className={classes.cardContent}>
                        <CentralizedTextField
                            id="areaId"
                            name="areaId"
                            label="Area ID"
                            value={areasDetails.areaId || ""}
                            onChange={handleOnChangeDetails}
                            disabled={selectedRow.length > 0}
                            helperText="Spaces and symbols will be removed upon saving"
                            required
                        />
                        <CentralizedTextField
                            id="areaName"
                            name="areaName"
                            label="Area Name"
                            value={areasDetails.areaName || ""}
                            onChange={handleOnChangeDetails}
                            required
                        />
                        <CentralizedTextField
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={3}
                            value={areasDetails.description || ""}
                            onChange={handleOnChangeDetails}
                            required
                        />
                        <Grid container className={classes.grid}>
                            <Grid item xs={12} sm={12} md={5} lg={6} xl={6} className={classes.gridItem}>
                                <CentralizedTextField
                                    id="createdBy"
                                    name="createdBy"
                                    label="Created By"
                                    value={areasDetails.createdBy || ""}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="dateCreated"
                                    name="dateCreated"
                                    label="Date Created"
                                    value={areasDetails.dateCreated ? moment(areasDetails.dateCreated).format('YYYY-MM-DD HH:mm') : ""}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.grid}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem}>
                                <CentralizedTextField
                                    id="modifiedBy"
                                    name="modifiedBy"
                                    label="Modified By"
                                    value={areasDetails.modifiedBy || ""}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="dateModified"
                                    name="dateModified"
                                    label="Date Modified"
                                    value={areasDetails.dateModified ? moment(areasDetails.dateModified).format('YYYY-MM-DD HH:mm') : ""}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </form>
            </Card>
        </React.Fragment>
    );
};

AreasForm.propTypes = {
    selectedRow: PropTypes.array.isRequired,
    userAllowedActions: PropTypes.array.isRequired
};

export const AreaForm = React.memo(AreasForm);