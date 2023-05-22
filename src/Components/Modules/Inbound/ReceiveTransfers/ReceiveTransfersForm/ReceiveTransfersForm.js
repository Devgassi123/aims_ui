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

import { receiveTransfersAPI } from '../../../../../redux/api/api';
// UTILITY
import { sessUser } from '../../../../Utils/SessionStorageItems';
// FUNCTIONS
import { useCustomStyle } from "../../../../../Functions/CustomStyle";
import { populateFields } from '../../../../../Functions/Util';
// COMPONENTS
import { BackdropLoad } from '../../../../Layout/Loader';
import ReceiveTransfersActions from './ReceiveTransfersActions';
import { ReceiveTransfersHeader } from './ReceiveTransfersHeader/ReceiveTransfersHeader';
import { ReceiveTransfersSubDetails } from './ReceiveTransfersSubDetails/ReceiveTransfersSubDetails';
// import { ReceiveReturnsSubDetails } from './ReceiveReturnsSubDetails/ReceiveReturnsSubDetails';

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

var lastTransferDoc = {};

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
    const [transferHdrData, setTransferHdrData] = useState({}); //to store the selected details of selected document due to organizations were disappearing

    useEffect(() => {
        if (selectedRow.length > 0) {
            setSelectedItem([])
            getTransfersDetails(selectedRow);
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

    const getTransfersDetails = async () => {
        try {
            const result = await receiveTransfersAPI().getById(selectedRow[0])
            if (result.status === 200) {
                populateFields(result.data.data.whTransferHeader);
                lastTransferDoc = result.data.data.whTransferHeader;
                setTransferHdrData(result.data.data.whTransferHeader);
            }
        } catch (error) {
            addToast("Error occurred in getting transfer details!", {
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

    const refreshItemTable = (whTransferId) => {
        // console.log("LAST PO",[lastTransferDoc])

        setShowBackdrop(true);
        setTimeout(() => {
            setSelectedRow([whTransferId])
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
            getTransfersDetails();
            setSelectedItem([]);
        }
        else {
            setSelectedRow([]);
        }
        setDisableActions(true);
    };

    const dataFormatter = (obj) => {
        const whTransferHeader = {
            arrivalDate: obj.arrivalDate === "" ? null : obj.arrivalDate,
            arrivalDate2: obj.arrivalDate === "" ? null : obj.arrivalDate,
            carrierAddress: obj.carrierAddress === "" ? null : obj.carrierAddress,
            carrierContact: obj.carrierContact === "" ? null : obj.carrierContact,
            carrierEmail: obj.carrierEmail === "" ? null : obj.carrierEmail,
            carrierId: obj.carrierId === "" ? null : obj.carrierId,
            carrierName: obj.carrierName === "" ? null : obj.carrierName,
            transferDate: obj.transferDate === "" ? null : obj.transferDate,
            whTransferId: obj.whTransferId === "" ? null : obj.whTransferId,
            whTransStatusId: obj.whTransStatusId === "" ? null : obj.whTransStatusId,
            whTransferStatus: obj.whTransferStatus === "" ? null : obj.whTransferStatus,
            refNumber: obj.refNumber === "" ? null : obj.refNumber,
            refNumber2: obj.refNumber2 === "" ? null : obj.refNumber2,
            remarks: obj.remarks === "" ? null : obj.remarks,
            whFromAddress: obj.whFromAddress === "" ? null : obj.whFromAddress,
            whFromContact: obj.whFromContact === "" ? null : obj.whFromContact,
            whFromEmail: obj.whFromEmail === "" ? null : obj.whFromEmail,
            whFromId: obj.whFromId === "" ? null : obj.whFromId,
            whFrom: obj.whFrom === "" ? null : obj.whFrom,
            createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
            modifiedBy: sessUser,
            dateCreated: obj.createdBy === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated).format("YYYY-MM-DDTHH:mm"),
            dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm")
        }

        if (obj.sku === "") {
            return {
                whTransferHeader,
                whTransDetails: [],
                whTransferUfields: null
            }
        }

        //means the order item is modified
        if (selectedItem.length > 0) {
            return {
                whTransferHeader,
                whTransDetails: [
                    {
                        whTransferLineId: selectedItem[0].whTransferLineId,
                        whTransferId: obj.whTransferId,
                        sku: obj.sku,
                        expectedQty: Number(obj.expectedQty),
                        whTransLineStatusId: obj.whTransLineStatusId === "" ? null : obj.whTransLineStatusId,
                        dateCreated: obj.createdBy2 === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated2).format("YYYY-MM-DDTHH:mm"),
                        dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
                        createdBy: obj.createdBy2 === "" ? sessUser : obj.createdBy2,
                        modifiedBy: sessUser,
                        remarks: obj.remarks2 === "" ? null : obj.remarks2
                    }
                ],
                whTransferUfields: null
            }
        }

        // new record
        return {
            whTransferHeader,
            whTransDetails: [
                {
                    whTransferLineId: null,
                    whTransferId: obj.returnsId,
                    sku: obj.sku,
                    expectedQty: Number(obj.expectedQty),
                    whTransLineStatusId: obj.whTransLineStatusId === "" ? null : obj.whTransLineStatusId,
                    dateCreated: obj.createdBy2 === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated2).format("YYYY-MM-DDTHH:mm"),
                    dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
                    createdBy: obj.createdBy2 === "" ? sessUser : obj.createdBy2,
                    modifiedBy: sessUser,
                    remarks: obj.remarks2 === "" ? null : obj.remarks2
                }
            ],
            whTransferUfields: null
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

            if (finalValues.whTransferHeader.whTransferId !== null) {
                if (finalValues.whTransDetails.length > 0) {
                    
                    //update document but new item
                    if(finalValues.whTransDetails[0].whTransferLineId === null) {

                    }
                    //update document and update item
                    //if the status is already not "CREATED", cannot be modified as it already has transactions
                    else if (finalValues.returnsDetails[0].whTransLineStatusId !== "CREATED") {
                        setDisableActions(false);
                        setShowBackdrop(false);

                        addToast("Item cannot be modified", {
                            appearance: "info",
                        });

                        return;
                    }
                }

                result = await receiveTransfersAPI().update(finalValues)
            }
            else {
                if (finalValues.whTransDetails[0].sku === "" || finalValues.whTransDetails.sku === null) {
                    setDisableActions(false);
                    setShowBackdrop(false);

                    addToast("Please provide SKU", {
                        appearance: "info",
                    });
                    return;
                }

                if (finalValues.whTransDetails[0].expectedQty < 1) {
                    setDisableActions(false);
                    setShowBackdrop(false);

                    addToast("Invalid Order Qty", {
                        appearance: "info",
                    });

                    return;
                }

                result = await receiveTransfersAPI().create(finalValues)
            }

            if (result.status === 200) {
                if (result.data.code === 0) {
                    setShowBackdrop(false);
                    setDisableActions(false);
                    addToast(result.data.message, {
                        appearance: "error",
                    });
                }
                else {
                    setReloadHdrTable(true);
                    setSelectedRow([]);
                    //means modified
                    if (finalValues.whTransferHeader.whTransferId !== null) {
                        refreshItemTable(lastTransferDoc.whTransferId)
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
                    title="Transfer Details"
                    className={customStyle.cardHdr}
                    action={
                        <IconButton onClick={() => setFullWidthTbl(true)}>
                            <CgCompress />
                        </IconButton>
                    }
                />
                <form id="formPOHeader" onSubmit={saveChanges} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
                    <ReceiveTransfersActions
                        isDisabled={disableActions}
                        handleClickNewItem={handleClickNewItem}
                        handleClickCancel={handleClickCancel}
                    />
                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={3}>
                            <Grid item lg={4}>
                                <ReceiveTransfersHeader 
                                    transferHdrData={transferHdrData} 
                                    clearValue={clearValue} 
                                    setClearValue={setClearValue} 
                                /> 
                            </Grid>
                            <Grid item lg={8}>
                                <ReceiveTransfersSubDetails
                                    whTransferId={selectedRow.length > 0 ? selectedRow[0] : null}
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

export const ReceiveTransfersForm = React.memo(Form);