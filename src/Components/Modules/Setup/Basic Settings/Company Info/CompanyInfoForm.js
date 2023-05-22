import React, { useState } from 'react';
import serialize from 'form-serialize';
import moment from 'moment';
import { useToasts } from "react-toast-notifications";

import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    Grid,
} from '@material-ui/core';

import { useCustomStyle } from "../../../../../Functions/CustomStyle";

// COMPONENTS
import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import LogoSelector from './LogoSelector';
import CompanyInfoActions from './CompanyInfoActions';

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
    warehouseId: 0,
    companyName: null,
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
    dateModified: new Date(),
    createdBy: null,
    modifiedBy: null
};

function CompanyInfoForm(props) {
    const { userAllowedActions } = props;

    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const [disableActions, setDisableActions] = useState(true);

    const handleOnChange = () => {
        setDisableActions(false);
    };

    const handleClickCancel = (event) => {
        setDisableActions(true);
        addToast("Transaction Cancelled", {
            appearance: "info",
        });
        //code to get again the company details
    };

    const dataFormatter = (obj) => {
        return {
            ...obj,
            telephone: obj.telephone === "" ? null : obj.telephone,
            mobile: obj.mobile === "" ? null : obj.mobile,
            email: obj.email === "" ? null : obj.email,
            province: obj.province === "" ? null : obj.province,
            city: obj.city === "" ? null : obj.city,
            zipCode: obj.zipCode === "" ? null : obj.zipCode,
            createdBy: obj.createdBy === "" ? "ADMIN" : obj.createdBy,
            modifiedBy: obj.modifiedBy === "" ? "ADMIN" : obj.modifiedBy,
            dateCreated: obj.dateCreated === "" ? moment(new Date()).format("YYYY-MM-DD HH:mm") : obj.dateCreated,
            dateModified: obj.dateCreated === "" ? moment(new Date()).format("YYYY-MM-DD HH:mm") : obj.dateModified,
        }
    };

    const saveChanges = (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const serializedForm = serialize(form, { hash: true, empty: true, disabled: true });
        const finalValues = dataFormatter(serializedForm);

        if(!userAllowedActions[0].actions.includes("MOD")){
            addToast("You are not allowed to use update action.", {
                appearance: "error",
            });
            return;
        }

        console.log("Final Values", finalValues);

        event.target.reset();
        addToast("Changes has been saved!", {
            appearance: "success",
        });
    };

    return (
        <Card>
            <CardHeader title="Details" className={customStyle.cardHdr} />
            <form onSubmit={saveChanges}>
                <CompanyInfoActions isDisabled={disableActions} handleClickCancel={handleClickCancel} />
                <CardContent className={classes.cardContent}>
                    <Grid container>
                        <Grid item md className={classes.gridItem1}>
                            <CentralizedTextField
                                id="companyName"
                                name="companyName"
                                label="Company Name"
                                inputProps={{
                                    maxLength: 100
                                }}
                                onChange={handleOnChange}
                                required
                            />
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
                        </Grid>
                        <Grid item md={4} className={classes.gridItem2}>
                            <LogoSelector />
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
                                inputProps={{
                                    maxLength: 10
                                }}
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
    );
};

export const CompanyInfoFormMemoized = React.memo(CompanyInfoForm);