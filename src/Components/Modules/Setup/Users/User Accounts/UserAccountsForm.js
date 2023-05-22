import React, { useEffect, useState } from 'react';
import moment from 'moment';
import serialize from 'form-serialize';
import { useToasts } from "react-toast-notifications";

import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    FormControlLabel,
    Grid,
    Radio,
} from '@material-ui/core';

import { useCustomStyle } from "../../../../../Functions/CustomStyle";
import { populateFields } from '../../../../../Functions/Util';
// COMPONENTS
import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import CentralizedRadioGrp from '../../../../Inputs/CentralizedRadioGrp/CentralizedRadioGrp';
import ImageSelector from '../../../../ImageSelector/ImageSelector';
import UserAccountsActions from './UserAccountsAction';
import { userAccAPI } from '../../../../../redux/api/api';
import { BackdropLoad } from '../../../../Layout/Loader';
import { sessUser } from '../../../../Utils/SessionStorageItems';
import { RoleOptionBox } from '../../../../ReferenceOptionBox/ReferenceOptionBox';

const useStyles = makeStyles((theme) => ({
    cardContent: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
        height: "100%",
        minHeight: 647,
        maxHeight: 647,
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
            margin: theme.spacing(.25, 0),
            maxWidth: "98%"
        },
        padding: "0px",
        [theme.breakpoints.down('md')]: {
            "& > *": {
                maxWidth: "100%"
            },
        }
    },
    gridItem2: {
        "& > *": {
            margin: theme.spacing(.25, 0),
            maxWidth: "100%",
        },
        alignContent: "right",
        padding: "0px",
        [theme.breakpoints.down('md')]: {
            "& > *": {
                maxWidth: "100%"
            },
        }
    }
}));

const initialAccountData = {
    userAccountId: "",
    password: "",
    accessRightId: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    image: "",
    email: "",
    phone: "",
    inactive: 0,
    accountExpiry: "",
    dateCreated: new Date(),
    dateModified: new Date(),
    createdBy: "",
    modifiedBy: ""
};

function UserAccountForm(props) {
    const { selectedRow, setSelectedRow, setReload } = props;
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const [accountDetails, setAccountDetails] = useState({ ...initialAccountData })
    const [disableActions, setDisableActions] = useState(true);
    const [clearValue, setClearValue] = useState(false);
    const [showBackdrop, setShowBackdrop] = useState(false);

    useEffect(() => {
        if (selectedRow.length > 0) {
            getAccountDetails();
        }
        else {
            resetForm();
        }
        // eslint-disable-next-line
    }, [selectedRow])

    useEffect(() => {
        let timeout;

        if (clearValue) {
            timeout = setTimeout(() => {
                setClearValue(false);
            }, 1000)
        }

        return () => clearTimeout(timeout);
    }, [clearValue])

    const resetForm = () => {
        const form = document.querySelector('#formAccount');
        form.reset();

        setAccountDetails({ ...initialAccountData });
        setClearValue(true);
        setDisableActions(true);
    };

    const getAccountDetails = async () => {
        setShowBackdrop(true);
        try {
            const result = await userAccAPI().getbyid(selectedRow[0]);
            if (result.status === 200) {
                populateFields(result.data.data);
                setAccountDetails(result.data.data);
                setShowBackdrop(false);
            }
        } catch (error) {
            setShowBackdrop(false);
            addToast("Error occurred in getting the details!\n\n" + error, {
                appearance: "error"
            })
        }
    };

    const handleOnChange = (event) => {
        disableActions && setDisableActions(false);
    };

    const handleClickNew = (event) => {
        setSelectedRow([]);
    };

    const handleClickCancel = (event) => {
        if(selectedRow.length > 0) {
            getAccountDetails();
        }
        else {
            resetForm();
        }
        setDisableActions(true);
        addToast("Transaction Cancelled", {
            appearance: "info",
        });
    };

    const dataFormatter = (obj) => {
        return {
            ...obj,
            userAccountId: String(obj.userAccountId.replace(/[^a-zA-Z0-9-_]/g, '')).toUpperCase(),
            password: obj.password === "passwordencrypted" ? accountDetails.password : obj.password,
            middleInitial: obj.middleInitial === "" ? null : obj.middleInitial,
            image: obj.image === "" ? null : obj.image,
            email: obj.email === "" ? null : obj.email,
            phone: obj.phone === "" ? null : obj.phone,
            inactive: Number(obj.inactive),
            accountExpiry: obj.accountExpiry === "" || obj.accountExpiry === null ? null : moment(obj.accountExpiry).format("YYYY-MM-DDTHH:mm"),
            createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
            modifiedBy: sessUser,
            dateCreated: obj.dateCreated === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated).format("YYYY-MM-DDTHH:mm"),
            dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm")
        }
    };

    const saveChanges = async (event) => {
        event.preventDefault();

        setDisableActions(true);
        setShowBackdrop(true);

        const form = event.currentTarget
        const serializedForm = serialize(form, { hash: true, empty: true, disabled: true });
        const finalValues = dataFormatter(serializedForm);

        console.log("dataFormatter", dataFormatter)

        if (String(finalValues.userAccountId).replace(/\s/g, '').replace(/-/g, '').replace(/_/g, '').length === 0) {
            addToast("Invalid Account ID.", {
                appearance: "error",
            });
            setShowBackdrop(false);
            return;
        }

        try {
            let result;
            if(selectedRow.length > 0) {
                result = await userAccAPI().update({userAccData: finalValues, userAccUfields: null});
            }
            else {
                result = await userAccAPI().create({userAccData: finalValues, userAccUfields: null});
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
                    setSelectedRow([]);
                    setReload(true);
                    addToast("Saved successfully!", {
                        appearance: "success"
                    })
                }
            }
        } catch (error) {
            setShowBackdrop(false);
            setDisableActions(false);
            addToast("Error occurred in saving details!\n\n" + error, {
                appearance: "error"
            })
        }
    };

    const saveImage = async (image) => {
        const finalValues = dataFormatter({...accountDetails, image: image});

        console.log("dataFormatter", accountDetails)

        try {
            const result = await userAccAPI().update({userAccData: finalValues, userAccUfields: null});
            if(result.status === 200) {
                if(result.data.code === 0) {
                    addToast(result.data.message, {
                        appearance: "error"
                    })
                }
                else {
                    addToast("Saved successfully!", {
                        appearance: "success"
                    })
                }
                return "success";
            }
        } catch (error) {
            addToast("Error occurred in saving picture!\n\n" + error, {
                appearance: "error"
            })
            return "success";
        }
    };

    return (
        <React.Fragment>
            <BackdropLoad show={showBackdrop} />
            <Card>
                <CardHeader title="Details" className={customStyle.cardHdr} />
                <form id="formAccount" onSubmit={saveChanges}>
                    <UserAccountsActions isDisabled={disableActions} handleClickNew={handleClickNew} handleClickCancel={handleClickCancel} />
                    <CardContent className={classes.cardContent}>
                        <Grid container>
                            <Grid item xs={12} lg={7} className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="userAccountId"
                                    name="userAccountId"
                                    label="Account ID"
                                    helperText="Spaces and symbols will be removed upon saving."
                                    onChange={handleOnChange}
                                    disabled={selectedRow.length > 0}
                                    inputProps={{
                                        maxLength: 50
                                    }}
                                    required
                                />
                                <CentralizedTextField
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 500
                                    }}
                                    required={selectedRow.length === 0}
                                />
                            </Grid>
                            <Grid item xs={12} lg={5} className={classes.gridItem2}>
                                <ImageSelector 
                                    id={accountDetails.userAccountId || ""} 
                                    title="user picture" 
                                    size={196} 
                                    base64Img={accountDetails.image || ""}
                                    onSaveImage={saveImage} 
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} lg className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 50
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="middleInitial"
                                    name="middleInitial"
                                    label="M. I."
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 1
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} lg className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <RoleOptionBox
                            id="accessRightId"
                            name="accessRightId"
                            label="Role"
                            defaultValue={accountDetails.accessRightId}
                            onChange={handleOnChange}
                            clearValue={clearValue}
                            required
                        />
                        <Grid container>
                            <Grid item xs={12} lg className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} lg className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="phone"
                                    name="phone"
                                    label="Phone"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 12
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <CentralizedRadioGrp
                            id="inactive"
                            name="inactive"
                            label="Inactive"
                            defaultValue={accountDetails.inactive}
                            onChange={handleOnChange}
                            clearValue={clearValue}
                        >
                            <FormControlLabel value={1} control={<Radio color="secondary" />} label="Yes" />
                            <FormControlLabel value={0} control={<Radio color="secondary" />} label="No" />
                        </CentralizedRadioGrp>
                        <CentralizedTextField
                            id="accountExpiry"
                            name="accountExpiry"
                            label="Account Expiration"
                            type="date"
                            onChange={handleOnChange}
                        />
                        <Grid container className={classes.grid}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="createdBy"
                                    name="createdBy"
                                    label="Created By"
                                    onChange={handleOnChange}
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

export const UserAccountFormMemoized = React.memo(UserAccountForm);