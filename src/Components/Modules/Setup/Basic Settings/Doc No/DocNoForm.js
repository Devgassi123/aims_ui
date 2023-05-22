import React, { useEffect, useState } from 'react';
import serialize from 'form-serialize';
import moment from 'moment';
import { useToasts } from "react-toast-notifications";

import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    Grid,
} from '@material-ui/core';

import { useCustomStyle } from "../../../../../Functions/CustomStyle";

// FUNCTIONS
import { populateFields } from '../../../../../Functions/Util';
// COMPONENTS
import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import DocNoActions from './DocNoActions';
import { sessUser } from '../../../../Utils/SessionStorageItems';
import { idNumberAPI } from '../../../../../redux/api/api';
import { BackdropLoad } from '../../../../Layout/Loader';

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
    grid: {
        padding: "0px 0px",
        justifyContent: "space-between"
    },
    gridItem1: {
        "& > *": {
            margin: theme.spacing(.75, 0),
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
            margin: theme.spacing(.75, 0),
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

const initialDocNoData = {
    transactionTypeId: null,
    prefix: null,
    suffix: null,
    startId: 0,
    lastId: 0,
    zeroesLength: null,
    dateCreated: null,
    dateModified: null,
    createdBy: null,
    modifiedBy: null
};

function DocNoForm(props) {
    const { selectedRow, setSelectedRow, setReload, userAllowedActions } = props;
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const [disableActions, setDisableActions] = useState(true);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [zeroesLength, setZeroesLength] = useState("")

    useEffect(() => {
        if (selectedRow.length > 0) {
            getIdNumberDetails();
        }
        else {
            populateFields({ ...initialDocNoData })
        }
        // eslint-disable-next-line
    }, [selectedRow])

    const getIdNumberDetails = async () => {
        setShowBackdrop(true)
        try {
            const result = await idNumberAPI().getbyid(selectedRow[0])
            if (result.status === 200) {
                populateFields(result.data.data);
                setZeroesLength(result.data.data.zeroesLength);
                setShowBackdrop(false);
            }
        } catch (error) {
            setShowBackdrop(false);
            addToast("Error occurred in getting details!\n" + error, {
                appearance: "error"
            });
        }
    };

    const handleOnChange = (event) => {
        if(event.target.name === "zeroesLength") {
            setZeroesLength(event.target.value.replace(/[^0]/g, ''))
            // setZeroesLength(event.target.value)
        }

        if ((selectedRow.length > 0) && (disableActions === true)) {
            setDisableActions(false);
        }
    };

    const handleClickCancel = (event) => {
        setDisableActions(true);
        getIdNumberDetails();
        addToast("Transaction Cancelled", {
            appearance: "info",
        });
        //reset value and selected row
    };

    const dataFormatter = (obj) => {
        return {
            ...obj,
            prefix: obj.prefix === "" ? null : obj.prefix,
            suffix: obj.suffix === "" ? null : obj.suffix,
            startId: Number(obj.startId),
            lastId: Number(obj.lastId),
            zeroesLength: obj.zeroesLength === "" ? null : obj.zeroesLength,
            remarks: obj.remarks === "" ? null : obj.remarks,
            createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
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

        setDisableActions(true);
        setShowBackdrop(true);

        const form = event.currentTarget;
        const serializedForm = serialize(form, { hash: true, empty: true, disabled: true });
        const finalValues = dataFormatter(serializedForm);

        try {
            const result = await idNumberAPI().update(finalValues)
            if (result.status === 200) {
                setShowBackdrop(false);
                if (result.data.code === 0) {
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
            setDisableActions(false);
            setShowBackdrop(false);
            addToast("Error occurred in saving the details!\n" + error, {
                appearance: "error"
            })
        }
    };

    return (
        <React.Fragment>
            <BackdropLoad show={showBackdrop} />
            <Card>
                <CardHeader title="Details" className={customStyle.cardHdr} />
                <form onSubmit={saveChanges}>
                    <DocNoActions isDisabled={disableActions} handleClickCancel={handleClickCancel} />
                    <CardContent className={classes.cardContent}>
                        <CentralizedTextField
                            id="transactionTypeId"
                            name="transactionTypeId"
                            label="Transaction Type ID"
                            disabled
                        />
                        <Grid container>
                            <Grid item xs={12} lg className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="prefix"
                                    name="prefix"
                                    label="Prefix"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 50
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} lg className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="suffix"
                                    name="suffix"
                                    label="Suffix"
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 50
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} lg className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="startId"
                                    name="startId"
                                    label="Start Id"
                                    type="number"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} lg className={classes.gridItem2}>
                                <CentralizedTextField
                                    id="lastId"
                                    name="lastId"
                                    label="Last Id"
                                    type="number"
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <CentralizedTextField
                            id="zeroesLength"
                            name="zeroesLength"
                            label="Format"
                            helperText="ex. If document number must be 6 digits, input it as '000000'"
                            value={zeroesLength}
                            onChange={handleOnChange}
                            inputProps={{
                                maxLength: 20
                            }}
                            disabled
                        />
                        <Grid container className={classes.grid}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem1}>
                                <CentralizedTextField
                                    id="createdBy"
                                    name="createdBy"
                                    className="createdBy"
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

export const DocNoFormMemoized = React.memo(DocNoForm);