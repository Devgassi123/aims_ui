import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useToasts } from "react-toast-notifications";
import serialize from 'form-serialize';
import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    Grid,
    IconButton,
} from '@material-ui/core';
import { CgCompress } from 'react-icons/cg'

import { receiveReturnAPI } from '../../../../../redux/api/api';
// UTILITY
import { sessUser } from '../../../../Utils/SessionStorageItems';
// FUNCTIONS
import { useCustomStyle } from "../../../../../Functions/CustomStyle";
import { populateFields } from '../../../../../Functions/Util';
// COMPONENTS
import { BackdropLoad } from '../../../../Layout/Loader';
import ReceiveReturnsActions from './ReceiveReturnsActions';
import { ReceiveReturnsHeader } from './ReceiveReturnsHeader/ReceiveReturnsHeader';
import { ReceiveReturnsSubDetails } from './ReceiveReturnsSubDetails/ReceiveReturnsSubDetails';

const useStyles = makeStyles((theme) => ({
    cardContent: {
        display: "flex",
        minHeight: "70vh",
        maxHeight: "70vh",
        // overflow: "auto",
        width: "100%"
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

var lastReturnDoc = {};

function Form(props) {
    const { selectedRow, setSelectedRow, setReloadHdrTable, setFullWidthTbl, setSoftReloadHdrTable } = props;

    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const [disableActions, setDisableActions] = useState(true);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [hideItemDetails, setHideItemDetails] = useState(true);
    const [selectedItem, setSelectedItem] = useState([]);
    const [clearValue, setClearValue] = useState(false);
    const [returnsHdrData, setReturnsHdrData] = useState({});

    useEffect(() => {
        if (selectedRow.length > 0) {
            setSelectedItem([])
            getReturnsDetails(selectedRow);
            setDisableActions(false);
        }
        else {
            resetForm();
        }
        // eslint-disable-next-line
    }, [selectedRow]);

    useEffect(() => {
        //to reset clearValue
        if (clearValue) {
            const timeout = setTimeout(() => {
                setClearValue(false)
            }, 1000)

            return () => clearTimeout(timeout)
        }
    }, [clearValue])

    const getReturnsDetails = async () => {
        try {
            const result = await receiveReturnAPI().getById(selectedRow[0])
            if (result.status === 200) {
                populateFields(result.data.data.returnsHeader);
                lastReturnDoc = result.data.data.returnsHeader;
                setReturnsHdrData(result.data.data.returnsHeader);
            }
        } catch (error) {
            addToast("Error occurred in getting returns details!", {
                appearance: "error"
            })
        }
    };

    const resetForm = () => {
        setClearValue(true)

        var form = document.querySelector('#formPOHeader')
        form.reset();
        setSelectedItem([])
    };

    const refreshItemTable = (returnsId) => {
        // console.log("LAST PO",[lastReturnDoc])

        setShowBackdrop(true);
        setTimeout(() => {
            setSelectedRow([returnsId])
            setShowBackdrop(false);
        }, 1000)
    };

    const handleClickNewItem = () => {
        setDisableActions(false);
        setHideItemDetails(false);
        setSelectedItem([])
    };

    const handleClickCancel = () => {
        if (selectedRow.length > 0) {
            getReturnsDetails();
            setSelectedItem([]);
        }
        else {
            setSelectedRow([]);
        }
        setDisableActions(true);
    };

    const dataFormatter = (obj) => {
        const returnsHeader = {
            arrivalDate: obj.arrivalDate === "" ? null : obj.arrivalDate,
            arrivalDate2: obj.arrivalDate === "" ? null : obj.arrivalDate,
            carrierAddress: obj.carrierAddress === "" ? null : obj.carrierAddress,
            carrierContact: obj.carrierContact === "" ? null : obj.carrierContact,
            carrierEmail: obj.carrierEmail === "" ? null : obj.carrierEmail,
            carrierId: obj.carrierId === "" ? null : obj.carrierId,
            carrierName: obj.carrierName === "" ? null : obj.carrierName,
            returnDate: obj.orderDate === "" ? null : obj.returnDate,
            returnsId: obj.returnsId === "" ? null : obj.returnsId,
            returnsStatusId: obj.returnsStatusId === "" ? null : obj.returnsStatusId,
            returnStatus: obj.returnStatus === "" ? null : obj.returnStatus,
            refNumber: obj.refNumber === "" ? null : obj.refNumber,
            refNumber2: obj.refNumber2 === "" ? null : obj.refNumber2,
            remarks: obj.remarks === "" ? null : obj.remarks,
            storeAddress: obj.storeAddress === "" ? null : obj.storeAddress,
            storeContact: obj.storeContact === "" ? null : obj.storeContact,
            storeEmail: obj.storeEmail === "" ? null : obj.storeEmail,
            storeId: obj.storeId === "" ? null : obj.storeId,
            storeName: obj.storeName === "" ? null : obj.storeName,
            createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
            modifiedBy: sessUser,
            dateCreated: obj.createdBy === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated).format("YYYY-MM-DDTHH:mm"),
            dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm")
        }

        if (obj.sku === "") {
            return {
                returnsHeader,
                returnsDetails: [],
                returnsUfields: null
            }
        }

        //means the order item is modified
        if (selectedItem.length > 0) {
            return {
                returnsHeader,
                returnsDetails: [
                    {
                        returnsLineId: selectedItem[0].returnsLineId,
                        returnsId: obj.returnsId,
                        sku: obj.sku,
                        expectedQty: Number(obj.expectedQty),
                        returnsLineStatusId: obj.returnsLineStatusId === "" ? null : obj.returnsLineStatusId,
                        dateCreated: obj.createdBy2 === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated2).format("YYYY-MM-DDTHH:mm"),
                        dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
                        createdBy: obj.createdBy2 === "" ? sessUser : obj.createdBy2,
                        modifiedBy: sessUser,
                        remarks: obj.remarks2 === "" ? null : obj.remarks2
                    }
                ],
                returnsUfields: null
            }
        }

        // new record
        return {
            returnsHeader,
            returnsDetails: [
                {
                    returnsLineId: null,
                    returnsId: obj.returnsId,
                    sku: obj.sku,
                    expectedQty: Number(obj.expectedQty),
                    returnsLineStatusId: obj.returnsLineStatusId === "" ? null : obj.returnsLineStatusId,
                    dateCreated: obj.createdBy2 === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated2).format("YYYY-MM-DDTHH:mm"),
                    dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
                    createdBy: obj.createdBy2 === "" ? sessUser : obj.createdBy2,
                    modifiedBy: sessUser,
                    remarks: obj.remarks2 === "" ? null : obj.remarks2
                }
            ],
            returnsUfields: null
        }
    };

    const saveChanges = async (event) => {
        event.preventDefault();

        setDisableActions(true);
        setShowBackdrop(true);

        var form = document.querySelector('#formPOHeader')
        var body = serialize(form, { hash: true, empty: true, disabled: true });
        var finalValues = dataFormatter(body);

        try {
            let result;

            if (finalValues.returnsHeader.returnsId !== null) {
                if (finalValues.returnsDetails.length > 0) {
                    console.log("finalValues", finalValues)

                    //update document but new item
                    if(finalValues.returnsDetails[0].returnsLineId === null) {

                    }
                    //update document and update item
                    //if the status is already not "CREATED", cannot be modified as it already has transactions
                    else if (finalValues.returnsDetails[0].returnsLineStatusId !== "CREATED") {
                        setDisableActions(false);
                        setShowBackdrop(false);

                        addToast("Item cannot be modified", {
                            appearance: "info",
                        });

                        return;
                    }
                }

                result = await receiveReturnAPI().update(finalValues)
            }
            else {
                if (finalValues.returnsDetails[0].sku === "" || finalValues.returnsDetails.sku === null) {
                    setDisableActions(false);
                    setShowBackdrop(false);

                    addToast("Please provide SKU", {
                        appearance: "info",
                    });
                    return;
                }

                if (finalValues.returnsDetails[0].expectedQty < 1) {
                    setDisableActions(false);
                    setShowBackdrop(false);

                    addToast("Invalid Order Qty", {
                        appearance: "info",
                    });

                    return;
                }

                result = await receiveReturnAPI().create(finalValues)
            }

            if (result.status === 200) {
                if (result.data.code === 0) {
                    setShowBackdrop(false);
                    addToast(result.data.message, {
                        appearance: "error",
                    });
                }
                else {
                    setReloadHdrTable(true);
                    setSelectedRow([]);
                    //means modified
                    if (finalValues.returnsHeader.returnsId !== null) {
                        refreshItemTable(lastReturnDoc.returnsId)
                    }
                    //means new
                    else {
                        refreshItemTable(result.data.data)
                    }
                    addToast("Saved successfully!", {
                        appearance: "success",
                    });
                }
            }
        } catch (error) {
            setShowBackdrop(false);
            setDisableActions(false);
            console.log("ERROR", error)
            addToast("Error occurred in saving the details!", {
                appearance: "error",
            });
        }
    };

    return (
        <React.Fragment>
            <BackdropLoad show={showBackdrop} />
            <Card>
                <CardHeader
                    title="Return Details"
                    className={customStyle.cardHdr}
                    action={
                        <IconButton onClick={() => setFullWidthTbl(true)}>
                            <CgCompress />
                        </IconButton>
                    }
                />
                <form id="formPOHeader" onSubmit={saveChanges} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
                    <ReceiveReturnsActions
                        isDisabled={disableActions}
                        handleClickNewItem={handleClickNewItem}
                        handleClickCancel={handleClickCancel}
                    />
                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={3}>
                            <Grid item lg={4}>
                                <ReceiveReturnsHeader returnsHdrData={returnsHdrData} clearValue={clearValue} setClearValue={setClearValue} />
                            </Grid>
                            <Grid item lg={8}>
                                <ReceiveReturnsSubDetails
                                    returnsId={selectedRow.length > 0 ? selectedRow[0] : null}
                                    hideItemDetails={hideItemDetails}
                                    setHideItemDetails={setHideItemDetails}
                                    selectedItem={selectedItem}
                                    setSelectedItem={setSelectedItem}
                                    clearValue={clearValue}
                                    setReloadHdrTable={setReloadHdrTable}
                                    setSoftReloadHdrTable={setSoftReloadHdrTable}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </form>
            </Card>
        </React.Fragment >
    );
};

Form.propTypes = {
    selectedRow: PropTypes.array.isRequired,
    setSelectedRow: PropTypes.func.isRequired,
    setReloadHdrTable: PropTypes.func.isRequired
};

export const ReceiveReturnsForm = React.memo(Form);