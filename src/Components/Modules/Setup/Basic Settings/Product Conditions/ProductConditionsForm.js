import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useToasts } from "react-toast-notifications";
import serialize from 'form-serialize';
import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    Grid,
} from '@material-ui/core';

import { useCustomStyle } from "../../../../../Functions/CustomStyle";
// API
import { productConditionAPI } from '../../../../../redux/api/api';

import { populateFields } from '../../../../../Functions/Util';
import { sessUser } from '../../../../Utils/SessionStorageItems';
// COMPONENTS
import { BackdropLoad } from '../../../../Layout/Loader';
import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import ProductConditionsActions from './ProductConditionsActions';

const useStyles = makeStyles((theme) => ({
    cardContent: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
        height: "100%",
        minHeight: 645,
        maxHeight: 645,
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

function Form(props) {
    const { selectedRow, setSelectedRow, setReload, userAllowedActions } = props;
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const [disableSave, setDisableSave] = useState(true);
    const [showBackdrop, setShowBackdrop] = useState(false);


    useEffect(() => {
        if (selectedRow.length > 0) {
            getPConditionDetails();
        }
        else {
            resetForm();
        }
        // eslint-disable-next-line
    }, [selectedRow])

    const getPConditionDetails = async () => {
        setShowBackdrop(true);
        try {
            const result = await productConditionAPI().getById(selectedRow[0].productConditionId)
            if (result.status === 200) {
                setShowBackdrop(false);
                if (result.data.code === 0) {
                    addToast("There's problem in getting the details. Please reload this page.", {
                        appearance: "error"
                    })
                }
                else {
                    populateFields(result.data.data)
                }
            }
        } catch (error) {
            setShowBackdrop(false);
            addToast("Error occurred in getting the details!", {
                appearance: "error"
            })
        }
    };

    const resetForm = () => {
        const form =  document.querySelector("#formUOM")
        form.reset();

        setDisableSave(false);
    }

    const handleClickNew = () => {
        setSelectedRow([]);
    };

    const handleClickCancel = () => {
        if (selectedRow.length > 0) {
            getPConditionDetails()
        }
        else {
            resetForm()
        }
        addToast("Transaction Cancelled", {
            appearance: "info",
        });
    };

    const handleOnChangeDetails = (event) => {
        setDisableSave(false);
    };

    const dataFormatter = (obj) => {
        return {
            ...obj,
            productConditionId: String(obj.productConditionId.replace(/[^a-zA-Z0-9-_]/g, '')).toUpperCase(),
            productCondition: obj.productCondition,
            description: obj.description === "" ? sessUser : obj.description,
            createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
            modifiedBy: sessUser,
            dateCreated: obj.createdBy === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated).format("YYYY-MM-DDTHH:mm"),
            dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm")
        }
    };

    const saveChanges = async (event) => {
        event.preventDefault();

        setShowBackdrop(true);
        setDisableSave(true);

        const form = event.currentTarget
        const serializedForm = serialize(form, { hash: true, disabled: true, empty: true })
        const finalValues = dataFormatter(serializedForm);

        if(String(finalValues.productConditionId).replace(/\s/g, '').replace(/-/g, '').replace(/_/g, '').length === 0) {
            addToast("Invalid Product Condition ID.", {
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
                result = await productConditionAPI().update(finalValues)
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
                result = await productConditionAPI().create(finalValues)
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
                    setDisableSave(true);
                    setReload(true);
                    addToast("Saved successfully!", {
                        appearance: "success",
                    });
                }
            }
        } catch (error) {
            setShowBackdrop(false);
            setDisableSave(false);
            addToast("Error occurred in saving details!\n" + error, {
                appearance: "error",
            });
        }
    };

    return (
        <React.Fragment>
            <BackdropLoad show={showBackdrop} />
            <Card>
                <CardHeader title="Details" className={customStyle.cardHdr} />
                <form id="formUOM" onSubmit={saveChanges} >
                    <ProductConditionsActions
                        isDisabled={disableSave}
                        handleClickNew={handleClickNew}
                        handleClickCancel={handleClickCancel}
                    />
                    <CardContent className={classes.cardContent}>
                        <CentralizedTextField
                            id="productConditionId"
                            name="productConditionId"
                            label="Product Condition ID"
                            onChange={handleOnChangeDetails}
                            disabled={selectedRow.length > 0}
                            helperText="Spaces and symbols will be removed upon saving"
                            InputProps={{
                                maxLength: 50
                            }}
                            required
                        />
                        <CentralizedTextField
                            id="productCondition"
                            name="productCondition"
                            label="Product Condition"
                            onChange={handleOnChangeDetails}
                            required
                        />
                        <CentralizedTextField
                            id="description"
                            name="description"
                            label="Description"
                            onChange={handleOnChangeDetails}
                            InputProps={{
                                maxLength: 200
                            }}
                        />
                        <Grid container className={classes.grid}>
                            <Grid item xs={12} sm={12} md={5} lg={6} xl={6} className={classes.gridItem}>
                                <CentralizedTextField
                                    id="createdBy"
                                    name="createdBy"
                                    label="Created By"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="dateCreated"
                                    name="dateCreated"
                                    label="Date Created"
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
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="dateModified"
                                    name="dateModified"
                                    label="Date Modified"
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

Form.propTypes = {
    selectedRow: PropTypes.array.isRequired,
    userAllowedActions: PropTypes.array.isRequired
};

export const ProductConditionsForm = React.memo(Form);