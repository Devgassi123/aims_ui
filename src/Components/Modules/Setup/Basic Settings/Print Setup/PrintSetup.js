import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useToasts } from 'react-toast-notifications';

import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader, Checkbox, Container, FormControlLabel, Grid, Radio
} from '@material-ui/core';


import { setActiveModules } from '../../../../../redux/actions/active_modules';
import { localPrinterAPI } from '../../../../../redux/api/api';

import { useCustomStyle } from "../../../../../Functions/CustomStyle";

import { BackdropLoad } from '../../../../Layout/Loader';
import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import CentralizedRadioGrp from '../../../../Inputs/CentralizedRadioGrp/CentralizedRadioGrp';
import { TagTypeOptionBox } from '../../../../ReferenceOptionBox/ReferenceOptionBox';
import PrintSetupsActions from './PrintSetupActions';
import PrintSetupTable from './PrintSetupTable';

const useStyles = makeStyles((theme) => ({
    cardContent: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
        flexGrow: 1,
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

export default function PrintSetup(props) {
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, []);

    // const [rowSelected, setRowSelected] = React.useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reload, setReload] = useState(true);

    const formik = useFormik({
        initialValues: {
            printerId: 0,
            name: "",
            ip: null,
            port: 0,
            docTypeId: null,
            dpiSizeId: "DPI300",
            darkness: 0,
            encodeEPC: false,
            isDefaultInType: false
        },
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: (values) => {
            saveChanges(values)
        },
    });

    useEffect(() => {
        stableDispatch(setActiveModules("Print Setup"));
    }, [stableDispatch]);

    const resetForm = () => {
        formik.resetForm();
    }

    const deletePrinter = async () => {
        try {
            const result = await localPrinterAPI().deletePrinter(formik.values.printerId)
            if(result.status === 200) {
                if(result.data.code === 1) {
                    resetForm();
                    setReload(true);
                    addToast("Deleted successfully!", {
                        appearance: "success"
                    })
                }
                else {
                    addToast(result.data.message, {
                        appearance: "error"
                    })
                }
            }
        } catch (error) {
            addToast(String(error), {
                appearance: "error"
            })
        }
    }

    const saveAs = () => {
        //so instead update, this will create new record
        formik.setFieldValue("printerId", 0);
        formik.handleSubmit();
    }

    const saveChanges = async (values) => {
        try {
            let result;

            if(formik.values.printerId === 0) {
                result = await localPrinterAPI().addPrinter(values)
            }
            else {
                result = await localPrinterAPI().updatePrinter(values)
            }
            if(result.status === 200) {
                if(result.data.code === 1) {
                    resetForm();
                    addToast("Save successfully!", {
                        appearance: "success"
                    })
                }
                else {
                    addToast(result.data.message, {
                        appearance: "error"
                    })
                }
                setReload(true);
            }
        } catch (error) {
            addToast(String(error), {
                appearance: "error"
            })
        }
    }

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <Container fixed>
                    <BackdropLoad show={isLoading} />
                    <Card>
                        <CardHeader title="Print Setup" className={customStyle.cardHdr} />
                        <form onSubmit={(event) => {event.preventDefault(); formik.handleSubmit();}}>
                            <PrintSetupsActions 
                                handleClickNew={resetForm} 
                                handleDelete={deletePrinter} 
                                handleSaveAs={saveAs} 
                                isDisableDelete={formik.values.printerId === 0}
                                isDisabled={formik.values.name.length === 0}
                            />
                            <CardContent className={classes.cardContent}>
                                <Grid container direction="row" justifyContent="space-between">
                                    <Grid item md={5}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={8}>
                                                <CentralizedTextField
                                                    id="ip"
                                                    name="ip"
                                                    label="IP Address of Printer"
                                                    margin="normal"
                                                    value={formik.values.ip || ""}
                                                    onChange={formik.handleChange}
                                                    InputProps={{
                                                        maxLength: 50
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <CentralizedTextField
                                                    id="port"
                                                    name="port"
                                                    label="Port"
                                                    margin="normal"
                                                    value={formik.values.port}
                                                    onChange={formik.handleChange}
                                                    type="number"
                                                />
                                            </Grid>
                                        </Grid>
                                        <CentralizedTextField
                                            id="name"
                                            name="name"
                                            label="Printer Name"
                                            margin="normal"
                                            value={formik.values.name || ""}
                                            onChange={formik.handleChange}
                                            InputProps={{
                                                maxLength: 50
                                            }}
                                        />
                                        <CentralizedRadioGrp
                                            id="dpiSizeId"
                                            name="dpiSizeId"
                                            label="DPI"
                                            margin="normal"
                                            defaultValue={formik.values.dpiSizeId}
                                            onChange={formik.handleChange}
                                        >
                                            <FormControlLabel value="DPI300" control={<Radio  />} label="300" />
                                            <FormControlLabel value="DPI203" control={<Radio  />} label="203" />
                                        </CentralizedRadioGrp>
                                        <CentralizedTextField
                                            id="darkness"
                                            name="darkness"
                                            label="Darkness"
                                            margin="normal"
                                            value={formik.values.darkness}
                                            onChange={formik.handleChange}
                                            type="number"
                                        />
                                        <TagTypeOptionBox
                                            id="docTypeId"
                                            name="docTypeId"
                                            label="Tag Type"
                                            margin="normal"
                                            defaultValue={formik.values.docTypeId || ""}
                                            onChange={formik.handleChange}
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={Boolean(formik.values.encodeEPC)} onChange={formik.handleChange} name="encodeEPC" />}
                                            label="Encode EPC"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={Boolean(formik.values.isDefaultInType)} onChange={formik.handleChange} name="isDefaultInType" />}
                                            label="Make this as default printer for the selected tag type."
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <PrintSetupTable 
                                            formik={formik} 
                                            setIsLoading={setIsLoading} 
                                            reload={reload} 
                                            setReload={setReload} 
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </form>
                    </Card>
                </Container>
            </div>
        </div>
    );
}