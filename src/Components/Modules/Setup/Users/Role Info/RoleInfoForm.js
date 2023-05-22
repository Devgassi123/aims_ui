import React, { useEffect, useState } from 'react';
import moment from 'moment';
import serialize from 'form-serialize';
import { useToasts } from "react-toast-notifications";
import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    Grid,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
// API
import { roleAPI } from '../../../../../redux/api/api';
// FUNCTIONS
import { useCustomStyle } from "../../../../../Functions/CustomStyle";
import { populateFields } from "../../../../../Functions/Util"
import { sessRole, sessUser } from '../../../../Utils/SessionStorageItems';
// COMPONENTS
import { BackdropLoad } from '../../../../Layout/Loader';
import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import RoleInfoActions from './RoleInfoActions';
import ModuleActionsTable from './ModuleActionsTable';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    alert: {
        margin: theme.spacing(2, 0)
    },
    cardContent: {
        height: "100%",
        minHeight: 648,
        maxHeight: 648,
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
            margin: theme.spacing(.50, 0),
        },
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
            margin: theme.spacing(.50, 0),
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
            margin: theme.spacing(.50, 0),
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

// eslint-disable-next-line
const initialRoleInfoData = {
    accessRightId: null,
    accessRightName: null,
    description: null,
    dateCreated: new Date(),
    dateModified: new Date(),
    createdBy: null,
    modifiedBy: null
};

function RoleInfoForm(props) {
    const { selectedRow, setSelectedRow, setReload } = props;
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const roleDetailsReducer = useSelector((state) => state.roleDetailsReducer.details)

    const [disableActions, setDisableActions] = useState(true);
    const [showBackdrop, setShowBackdrop] = useState(false);

    useEffect(() => {
        if (selectedRow.length > 0) {
            getRoleDetails(selectedRow);
        }
        // eslint-disable-next-line
    }, [selectedRow])

    const getRoleDetails = async (id) => {
        try {
            const result = await roleAPI().getbyid(id);
            if (result.status === 200) {
                populateFields(result.data.data)
            }
        } catch (error) {
            addToast("Error occurred in getting roles!", {
                appearance: "error",
            });
            console.log("ERROR", `${error}`)
        }
    };

    const handleOnChange = (event) => {
        setDisableActions(false);
    };

    const handleClickNew = () => {
        setShowBackdrop(true);
        setDisableActions(false);
        var form = document.querySelector('#formRole');
        form.reset();
        setSelectedRow([]);
        setShowBackdrop(false);
    };

    const handleClickCancel = (event) => {
        setDisableActions(true);
        getRoleDetails(selectedRow);
        addToast("Transaction Cancelled", {
            appearance: "info",
        });
        //reset value and selected row
    };

    const dataFormatter = (obj) => {
        Object.keys(obj).forEach((key) =>
            String(key).includes("chk") && delete obj[key]
        )

        return {
            ...obj,
            accessRightId: String(obj.accessRightId.replace(/[^a-zA-Z0-9-_]/g, '')).toUpperCase(),
            description: obj.description ? obj.description : null,
            createdBy: obj.createdBy ? obj.createdBy : sessUser,
            modifiedBy: sessUser,
            dateCreated: obj.createdBy ? moment(obj.dateCreated).format("YYYY-MM-DDTHH:MM") : moment(new Date()).format("YYYY-MM-DDTHH:MM"),
            dateModified: moment(new Date()).format("YYYY-MM-DDTHH:MM")
        }
    };

    const saveChanges = async (event) => {
        event.preventDefault();

        setShowBackdrop(true);
        const form = event.currentTarget
        const serializedForm = serialize(form, { hash: true, empty: true, disabled: true });
        const finalValues = dataFormatter(serializedForm);

        if (finalValues.accessRightId === "ADMIN") {
            addToast("You cannot modify ADMIN role", {
                appearance: "info",
            });
            setShowBackdrop(false);
            return;
        }

        if (String(finalValues.accessRightId).replace(/\s/g, '').replace(/-/g, '').replace(/_/g, '').length === 0) {
            addToast("Invalid Role ID.", {
                appearance: "error",
            });
            setShowBackdrop(false);
            return;
        }

        setDisableActions(true);
        var result;
        try {
            if (selectedRow.length > 0) {
                result = await roleAPI().update(finalValues, roleDetailsReducer);
            }
            else {
                result = await roleAPI().create(finalValues);
            }

            if (result.status === 200) {
                setShowBackdrop(false)

                if (result.data.code === 0) {
                    addToast(result.data.message, {
                        appearance: "error",
                    });
                }
                else {
                    addToast("Saved successfully!", {
                        appearance: "success",
                    });

                    if (finalValues.accessRightId === sessRole) {
                        window.location.reload(true)
                    }
                    else {
                        form.reset();
                        setSelectedRow([]);
                        setReload(true);
                    }
                }
            }
            else {
                setDisableActions(false);
                setShowBackdrop(false)
                addToast(result.data.message, {
                    appearance: "error",
                })
            }
        } catch (error) {
            addToast("Error occurred in saving role details!\n" + error, {
                appearance: "error",
            });
            console.log("RESULT", result)
            setDisableActions(false);
            setShowBackdrop(false)
        }
    };

    return (
        <React.Fragment>
            <BackdropLoad show={showBackdrop} />
            <Card>
                <CardHeader title="Details" className={customStyle.cardHdr} />
                <form id="formRole" onSubmit={saveChanges}>
                    <RoleInfoActions isDisabled={disableActions} handleClickNew={handleClickNew} handleClickCancel={handleClickCancel} />
                    <CardContent className={classes.cardContent}>
                        <Grid item xs={12} lg className={classes.fields}>
                            <Grid container>
                                <Grid item md className={classes.gridItem1}>
                                    <CentralizedTextField
                                        id="accessRightId"
                                        name="accessRightId"
                                        label="Role ID"
                                        onChange={handleOnChange}
                                        inputProps={{
                                            maxLength: 50
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid item md className={classes.gridItem2}>
                                    <CentralizedTextField
                                        id="accessRightName"
                                        name="accessRightName"
                                        label="Role Name"
                                        onChange={handleOnChange}
                                        inputProps={{
                                            maxLength: 100
                                        }}
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <CentralizedTextField
                                id="description"
                                name="description"
                                label="Description"
                                onChange={handleOnChange}
                                inputProps={{
                                    maxLength: 200
                                }}
                                required
                            />
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
                        </Grid>
                        <Alert severity="info" className={classes.alert}>
                            <AlertTitle>Info</AlertTitle>
                            <u>Tick</u> the corresponding actions for each module below, to allow the users for such actions with this role.&nbsp;
                            <u>Untick</u> if the users with this role is not allowed for such actions. Unticked <u>VIEW</u> action will result to hide the
                            module to user and disregard the other ticked actions.
                        </Alert>
                        <ModuleActionsTable roleName={selectedRow} setDisableActions={setDisableActions} setShowBackdrop={setShowBackdrop} />
                    </CardContent>
                </form>
            </Card>
        </React.Fragment>
    );
};

export const RoleInfoFormMemoized = React.memo(RoleInfoForm, (prevProps, nextProps) => {
    if (prevProps.selectedRow === nextProps.selectedRow) {
        return true;
    }
    return false;
});