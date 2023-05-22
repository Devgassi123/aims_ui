import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import moment from 'moment';

import { useToasts } from "react-toast-notifications";

import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    Grid,
} from '@material-ui/core';

import { useCustomStyle } from "../../../../Functions/CustomStyle";
//API
import { warehouseAPI } from '../../../../redux/api/api';
// UTILITY
import { sessUser } from '../../../Utils/SessionStorageItems';
// FUNCTIONS
import { populateFields } from '../../../../Functions/Util';
// COMPONENTS
import { BackdropLoad } from '../../../Layout/Loader';
import CentralizedTextField from '../../../Inputs/CentralizedTextField/CentralizedTextField';
import WarehousesActions from "./WarehousesAction";

const useStyles = makeStyles((theme) => ({
    cardContent: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
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
    grid: {
        padding: "0px 0px",
        justifyContent: "space-between"
    },
    gridItem1: {
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
// eslint-disable-next-line
const initialWarehouseData = {
    warehouseId: null,
    warehouseName: null,
    description: null,
    address: null,
    address2: null,
    province: null,
    city: null,
    zipCode: null,
    telephone: null,
    phone: null,
    email: null,
    dateCreated: new Date(),
    dateModified: null,
    createdBy: null,
    modifiedBy: null
};

function WarehousesForm(props) {
    const { userAllowedActions } = props;
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const [disableActions, setDisableActions] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getWarehouseInfo();
        // eslint-disable-next-line
    }, [])

    const getWarehouseInfo = async () => {
        setLoading(true);
        try {
            const result = await warehouseAPI().getAll();
            if (result.status === 200) {
                if (result.data.data) {
                    populateFields(result.data.data[0]);
                }
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            addToast("Error occurred in getting warehouse info!", {
                appearance: "error",
            });
            console.log("ERROR", `${error}`);
        }
    };

    const handleOnChange = () => {
        setDisableActions(false);
    };

    const handleClickCancel = (event) => {
        setDisableActions(true);
        addToast("Transaction Cancelled", {
            appearance: "info",
        });
        getWarehouseInfo();
    };

    const dataFormatter = (obj) => {
        return {
            ...obj,
            description: obj.description === "" ? null : obj.description,
            address: obj.address === "" ? null : obj.address,
            address2: obj.address2 === "" ? null : obj.address2,
            province: obj.province === "" ? null : obj.province,
            city: obj.city === "" ? null : obj.city,
            zipCode: obj.zipCode === "" ? null : obj.zipCode,
            telephone: obj.telephone === "" ? null : obj.telephone,
            phone: obj.phone === "" ? null : obj.phone,
            email: obj.email === "" ? null : obj.email,
            createdBy: obj.createdBy,
            modifiedBy: sessUser,
            dateCreated: obj.dateCreated === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated).format("YYYY-MM-DDTHH:mm"),
            dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm"),

        }
    };

    const saveChanges = async (event) => {
        event.preventDefault();

        if(!userAllowedActions[0].actions.includes("MOD")){
            addToast("You are not allowed to use update action.", {
                appearance: "error",
            });
            return;
        }

        setLoading(true);
        setDisableActions(true);
        var form = event.currentTarget;
        var serializedForm = serialize(form, { hash: true, empty: true, disabled: true });
        var finalValues = dataFormatter(serializedForm);

        try {
            const result = await warehouseAPI().update(finalValues)
            if (result.status === 200) {
                getWarehouseInfo();
                addToast("Saved successfully!", {
                    appearance: "success",
                });
            }
        } catch (error) {
            addToast("Error occurred in saving warehouse info!", {
                appearance: "error",
            });
            console.log("ERROR", `${error}`)
        }
    };

    return (
        <React.Fragment>
            <BackdropLoad show={loading} />
            <Card>
                <CardHeader title="Details" className={customStyle.cardHdr} />
                <form id="formWarehouse" onSubmit={saveChanges}>
                    <WarehousesActions isDisabled={disableActions} handleClickCancel={handleClickCancel} />
                    <CardContent className={classes.cardContent}>
                        <Grid container>
                            <Grid item md className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="warehouseId"
                                    name="warehouseId"
                                    label="Warehouse ID"
                                    className={classes.hidden}
                                    // disabled
                                />
                                <CentralizedTextField
                                    id="warehouseName"
                                    name="warehouseName"
                                    label="Warehouse Name"
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                    onChange={handleOnChange}
                                    required
                                />
                            </Grid>
                            <Grid item md className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="description"
                                    name="description"
                                    label="Description"
                                    inputProps={{
                                        maxLength: 200
                                    }}
                                    onChange={handleOnChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item md className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="address"
                                    name="address"
                                    label="Primary Address"
                                    multiline
                                    rows={3}
                                    inputProps={{
                                        maxLength: 200
                                    }}
                                    onChange={handleOnChange}
                                    required
                                />
                            </Grid>
                            <Grid item md className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="address2"
                                    name="address2"
                                    label="Secondary Address"
                                    multiline
                                    rows={3}
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 200
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item md className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="telephone"
                                    name="telephone"
                                    label="Telephone No."
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                />
                            </Grid>
                            <Grid item md className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="phone"
                                    name="phone"
                                    label="Mobile No."
                                    helperText="ex. 9876543210"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                />
                            </Grid>
                            <Grid item md className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    helperText="ex. company@gmail.com"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item md className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="province"
                                    name="province"
                                    label="Province"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                />
                            </Grid>
                            <Grid item md className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="city"
                                    name="city"
                                    label="City"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                />
                            </Grid>
                            <Grid item md className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="zipCode"
                                    name="zipCode"
                                    label="Zip Code"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 10
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container className={classes.grid}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem1}>
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
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem1}>
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

WarehousesForm.propTypes = {
    userAllowedActions: PropTypes.array.isRequired
}

export const WarehouseForm = React.memo(WarehousesForm);