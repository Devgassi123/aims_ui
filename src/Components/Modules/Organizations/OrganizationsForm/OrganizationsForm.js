import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useToasts } from "react-toast-notifications";
import serialize from 'form-serialize';
import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    Grid,
} from '@material-ui/core';

import { organizationAPI } from '../../../../redux/api/api';
// UTILITY
import { sessUser } from '../../../Utils/SessionStorageItems';
// FUNCTIONS
import { useCustomStyle } from "../../../../Functions/CustomStyle";
import { populateFields } from '../../../../Functions/Util';
// COMPONENTS
import { BackdropLoad } from '../../../Layout/Loader';
import OrganizationActions from './OrganizationsAction';
import { BasicInfoForm } from './BasicInfo';
import { LocationInfoForm } from './LocationInfo';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    cardContent: {
        flexGrow: 1,
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
    fields: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
    },
    hidden: {
        display: "none"
    }
}));

const initialOrgData = {
    organizationId: "",
    organizationName: "",
    organizationTypeID: "",
    inactive: 0,
    remarks: "",
    address: "",
    address2: "",
    telephone: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    zipCode: "",
    dateCreated: "",
    dateModified: "",
    createdBy: "",
    modifiedBy: "",
};

function OrganizationsForm(props) {
    const { selectedRow, setSelectedRow, setReload, userAllowedActions } = props;
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const [disableActions, setDisableActions] = useState(true);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [clearValue, setClearValue] = useState(false);
    const [orgDetails, setOrgDetails] = useState({ ...initialOrgData });

    useEffect(() => {
        if (selectedRow.length > 0) {
            getOrganizationDetails(selectedRow);
        }
        else {
            setDisableActions(true);
            setClearValue(true);
            setOrgDetails({ ...initialOrgData })

            var form = document.querySelector('#formOrganization')
            form.reset();
        }
        // eslint-disable-next-line
    }, [selectedRow]);

    useEffect(() => {
        let timeout;

        if (clearValue) {
            timeout = setTimeout(() => {
                setClearValue(false);
            }, 1000)
        }

        return () => clearTimeout(timeout);
    }, [clearValue])

    const getOrganizationDetails = async () => {
        try {
            const result = await organizationAPI().getbyid(selectedRow[0])
            if (result.status === 200) {
                populateFields(result.data.data);
                setOrgDetails(result.data.data);
            }
        } catch (error) {
            addToast("Error occurred in getting organization details!", {
                appearance: "error"
            })
        }
    };

    const handleClickNew = () => {
        setSelectedRow([]);
        setClearValue(true);
        setOrgDetails({ ...initialOrgData })

        var form = document.querySelector('#formOrganization')
        form.reset();
    };

    const handleClickCancel = () => {
        if(selectedRow.length > 0) {
            getOrganizationDetails();
        }
        else {
            var form = document.querySelector('#formOrganization')
            form.reset();
            setClearValue(true);
            setOrgDetails({ ...initialOrgData })
        }
        setDisableActions(true);
        addToast("Transaction Cancelled", {
            appearance: "info",
        });
    };

    const handleOnChange = (event) => {
        setDisableActions(false);
    };

    const dataFormatter = (obj) => {
        return {
            ...obj,
            organizationId: String(obj.organizationId.replace(/[^a-zA-Z0-9-_]/g, '')).toLocaleUpperCase(),
            inactive: Number(obj.inactive),
            remarks: obj.remarks === "" ? null : obj.remarks,
            address: obj.address === "" ? null : obj.address,
            address2: obj.address2 === "" ? null : obj.address2,
            telephone: obj.telephone === "" ? null : obj.telephone,
            phone: obj.phone === "" ? null : obj.phone,
            email: obj.email === "" ? null : obj.email,
            province: obj.province === "" ? null : obj.province,
            city: obj.city === "" ? null : obj.city,
            zipCode: obj.zipCode === "" ? null : obj.zipCode,
            createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
            modifiedBy: sessUser,
            dateCreated: obj.createdBy === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated).format("YYYY-MM-DDTHH:mm"),
            dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm")
        }
    };

    const saveChanges = async (event) => {
        event.preventDefault();

        setDisableActions(true);
        setShowBackdrop(true);

        var form = event.currentTarget
        var body = serialize(form, { hash: true, empty: true, disabled: true });
        var finalValues = dataFormatter(body);

        if(String(finalValues.organizationId).replace(/\s/g, '').replace(/-/g, '').replace(/_/g, '').length === 0) {
            addToast("Invalid Organization ID.", {
                appearance: "error",
            });
            setDisableActions(false);
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
                    return;
                }
                result = await organizationAPI().update(finalValues)
            }
            else {
                if(!userAllowedActions[0].actions.includes("ADD")){
                    addToast("You are not allowed to use add action.", {
                        appearance: "error",
                    });
                    return;
                }
                result = await organizationAPI().create(finalValues)
            }

            if (result.status === 200) {
                setShowBackdrop(false);
                if (result.data.code === 0) {
                    addToast(result.data.message, {
                        appearance: "error",
                    });
                }
                else {
                    setReload(true);
                    handleClickNew();
                    addToast("Saved successfully!", {
                        appearance: "success",
                    });
                }
            }
        } catch (error) {
            setShowBackdrop(false);
            addToast("Error occurred in saving the details!", {
                appearance: "error",
            });
        }
    };

    return (
        <React.Fragment>
            <BackdropLoad show={showBackdrop} />
            <Card>
                <CardHeader title="Details" className={customStyle.cardHdr} />
                <form id="formOrganization" onSubmit={saveChanges}>
                    <OrganizationActions isDisabled={disableActions} handleClickNew={handleClickNew} handleClickCancel={handleClickCancel} />
                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={3}>
                            <Grid item md className={classes.fields}>
                                <BasicInfoForm
                                    basicInfo={orgDetails}
                                    onChangeDetails={handleOnChange}
                                    clearValue={clearValue}
                                />
                            </Grid>
                            <Grid item md className={classes.fields}>
                                <LocationInfoForm
                                    locationInfo={orgDetails}
                                    onChangeDetails={handleOnChange}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </form>
            </Card>
        </React.Fragment>
    );
};

OrganizationsForm.propTypes = {
    selectedRow: PropTypes.array.isRequired,
    userAllowedActions: PropTypes.array.isRequired
};

export const OrganizationForm = React.memo(OrganizationsForm);