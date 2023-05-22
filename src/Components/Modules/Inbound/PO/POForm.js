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

import { purchaseOrderAPI } from '../../../../redux/api/api';
// UTILITY
// import { sessUser } from '../../../Utils/SessionStorageItems';
// FUNCTIONS
import { useCustomStyle } from "../../../../Functions/CustomStyle";
import { populateFields } from '../../../../Functions/Util';
// COMPONENTS
import { BackdropLoad } from '../../../Layout/Loader';
import POActions from './POActions';
import { POHeader } from './POHeader/POHeader';
import { POSubDetails } from './POSubDetails/POSubDetails';
import { sessUser } from '../../../Utils/SessionStorageItems';
// import { BasicInfoForm } from './BasicInfo';
// import { LocationInfoForm } from './LocationInfo';
// const sessUser = JSON.parse(sessionStorage.getItem("user"));

const useStyles = makeStyles((theme) => ({
    cardContent: {
        display: "flex",
        minHeight: "70vh",
        maxHeight: "70vh",
        overflow: "auto",
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

var lastPO = {};

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
    const [poHdrData, setPOHdrData] = useState({})

    useEffect(() => {
        if (selectedRow.length > 0) {
            setSelectedItem([])
            getPODetails(selectedRow);
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

    const getPODetails = async () => {
        try {
            const result = await purchaseOrderAPI().getbyid(selectedRow[0])
            if (result.status === 200) {
                populateFields(result.data.data.poHeader);
                lastPO = result.data.data.poHeader;
                setPOHdrData(result.data.data.poHeader)
            }
        } catch (error) {
            addToast("Error occurred in getting order details!", {
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

    const refreshItemTable = (poId) => {
        // console.log("LAST PO",[lastPO])

        setShowBackdrop(true);
        setTimeout(() => {
            setSelectedRow([poId])
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
            getPODetails();
            setSelectedItem([]);
        }
        else {
            setSelectedRow([]);
        }
        setDisableActions(true);
    };

    const openPrintPreview = () => {
        window.open(`/print/po/${selectedRow[0]}`, "_blank");
    };

    const dataFormatter = (obj) => {
        if (obj.sku === "") {
            return {
                poHeader: {
                    arrivalDate: obj.arrivalDate === "" ? null : obj.arrivalDate,
                    arrivalDate2: obj.arrivalDate === "" ? null : obj.arrivalDate,
                    carrierAddress: obj.carrierAddress === "" ? null : obj.carrierAddress,
                    carrierContact: obj.carrierContact === "" ? null : obj.carrierContact,
                    carrierEmail: obj.carrierEmail === "" ? null : obj.carrierEmail,
                    carrierId: obj.carrierId === "" ? null : obj.carrierId,
                    carrierName: obj.carrierName === "" ? null : obj.carrierName,
                    orderDate: obj.orderDate === "" ? null : obj.orderDate,
                    poId: obj.poId === "" ? null : obj.poId,
                    poStatusId: obj.poStatusId === "" ? null : obj.poStatusId,
                    refNumber: obj.refNumber === "" ? null : obj.refNumber,
                    refNumber2: obj.refNumber2 === "" ? null : obj.refNumber2,
                    remarks: obj.remarks === "" ? null : obj.remarks,
                    supplierAddress: obj.supplierAddress === "" ? null : obj.supplierAddress,
                    supplierContact: obj.supplierContact === "" ? null : obj.supplierContact,
                    supplierEmail: obj.supplierEmail === "" ? null : obj.supplierEmail,
                    supplierId: obj.supplierId === "" ? null : obj.supplierId,
                    supplierName: obj.supplierName === "" ? null : obj.supplierName,
                    createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
                    modifiedBy: sessUser,
                    dateCreated: obj.createdBy === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated).format("YYYY-MM-DDTHH:mm"),
                    dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm")
                },
                poDetails: [],
                poUfields: null
            }
        }

        //means the order item is modified
        if (selectedItem.length > 0) {
            return {
                poHeader: {
                    arrivalDate: obj.arrivalDate === "" ? null : obj.arrivalDate,
                    arrivalDate2: obj.arrivalDate === "" ? null : obj.arrivalDate,
                    carrierAddress: obj.carrierAddress === "" ? null : obj.carrierAddress,
                    carrierContact: obj.carrierContact === "" ? null : obj.carrierContact,
                    carrierEmail: obj.carrierEmail === "" ? null : obj.carrierEmail,
                    carrierId: obj.carrierId === "" ? null : obj.carrierId,
                    carrierName: obj.carrierName === "" ? null : obj.carrierName,
                    orderDate: obj.orderDate === "" ? null : obj.orderDate,
                    poId: obj.poId === "" ? null : obj.poId,
                    poStatusId: obj.poStatusId === "" ? null : obj.poStatusId,
                    refNumber: obj.refNumber === "" ? null : obj.refNumber,
                    refNumber2: obj.refNumber2 === "" ? null : obj.refNumber2,
                    remarks: obj.remarks === "" ? null : obj.remarks,
                    supplierAddress: obj.supplierAddress === "" ? null : obj.supplierAddress,
                    supplierContact: obj.supplierContact === "" ? null : obj.supplierContact,
                    supplierEmail: obj.supplierEmail === "" ? null : obj.supplierEmail,
                    supplierId: obj.supplierId === "" ? null : obj.supplierId,
                    supplierName: obj.supplierName === "" ? null : obj.supplierName,
                    createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
                    modifiedBy: sessUser,
                    dateCreated: obj.createdBy === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated).format("YYYY-MM-DDTHH:mm"),
                    dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm")
                },
                poDetails: [
                    {
                        poLineId: selectedItem[0].poLineId,
                        poId: obj.poId,
                        sku: obj.sku,
                        orderQty: Number(obj.orderQty),
                        poLineStatusId: obj.poLineStatusId === "" ? null : obj.poLineStatusId,
                        dateCreated: obj.createdBy2 === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated2).format("YYYY-MM-DDTHH:mm"),
                        dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
                        createdBy: obj.createdBy2 === "" ? sessUser : obj.createdBy2,
                        modifiedBy: sessUser,
                        remarks: obj.remarks2 === "" ? null : obj.remarks2
                    }
                ],
                poUfields: null
            }
        }

        // new record
        return {
            poHeader: {
                arrivalDate: obj.arrivalDate === "" ? null : obj.arrivalDate,
                arrivalDate2: obj.arrivalDate === "" ? null : obj.arrivalDate,
                carrierAddress: obj.carrierAddress === "" ? null : obj.carrierAddress,
                carrierContact: obj.carrierContact === "" ? null : obj.carrierContact,
                carrierEmail: obj.carrierEmail === "" ? null : obj.carrierEmail,
                carrierId: obj.carrierId === "" ? null : obj.carrierId,
                carrierName: obj.carrierName === "" ? null : obj.carrierName,
                orderDate: obj.orderDate === "" ? null : obj.orderDate,
                poId: obj.poId === "" ? null : obj.poId,
                poStatusId: obj.poStatusId === "" ? null : obj.poStatusId,
                refNumber: obj.refNumber === "" ? null : obj.refNumber,
                refNumber2: obj.refNumber2 === "" ? null : obj.refNumber2,
                remarks: obj.remarks === "" ? null : obj.remarks,
                supplierAddress: obj.supplierAddress === "" ? null : obj.supplierAddress,
                supplierContact: obj.supplierContact === "" ? null : obj.supplierContact,
                supplierEmail: obj.supplierEmail === "" ? null : obj.supplierEmail,
                supplierId: obj.supplierId === "" ? null : obj.supplierId,
                supplierName: obj.supplierName === "" ? null : obj.supplierName,
                createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
                modifiedBy: sessUser,
                dateCreated: obj.createdBy === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated).format("YYYY-MM-DDTHH:mm"),
                dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm")
            },
            poDetails: [
                {
                    poLineId: null,
                    poId: obj.poId,
                    sku: obj.sku,
                    orderQty: Number(obj.orderQty),
                    poLineStatusId: obj.poLineStatusId === "" ? null : obj.poLineStatusId,
                    dateCreated: obj.createdBy2 === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(obj.dateCreated2).format("YYYY-MM-DDTHH:mm"),
                    dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
                    createdBy: obj.createdBy2 === "" ? sessUser : obj.createdBy2,
                    modifiedBy: sessUser,
                    remarks: obj.remarks2 === "" ? null : obj.remarks2
                }
            ],
            poUfields: null
        }
    };

    const saveChanges = async (event) => {
        event.preventDefault();

        setDisableActions(true);
        setShowBackdrop(true);

        var form = document.querySelector('#formPOHeader')
        var body = serialize(form, { hash: true, empty: true, disabled: true });
        // console.log("BODY", body)
        var finalValues = dataFormatter(body);
        // console.log("FINAL VALUES", finalValues)

        try {
            let result;

            if (finalValues.poHeader.poId !== null) {
                if(finalValues.poDetails.length > 0) {
                    if (finalValues.poDetails[0].poLineStatusId !== "CREATED" && finalValues.poDetails[0].poLineStatusId !== null) {
                        setDisableActions(false);
                        setShowBackdrop(false);
        
                        addToast("Item cannot be modified", {
                            appearance: "info",
                        });
        
                        return;
                    }
                }

                result = await purchaseOrderAPI().update(finalValues)
            }
            else {
                if (finalValues.poDetails[0].sku === "" || finalValues.poDetails.sku === null) {
                    setDisableActions(false);
                    setShowBackdrop(false);

                    addToast("Please provide SKU", {
                        appearance: "info",
                    });
                    return;
                }

                if (finalValues.poDetails[0].orderQty < 1) {
                    setDisableActions(false);
                    setShowBackdrop(false);

                    addToast("Invalid Order Qty", {
                        appearance: "info",
                    });

                    return;
                }

                result = await purchaseOrderAPI().create(finalValues)
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
                    if (finalValues.poHeader.poId !== null) {
                        refreshItemTable(lastPO.poId)
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
            console.log("ERROR", error)
        }
    };

    return (
        <React.Fragment>
            <BackdropLoad show={showBackdrop} />
            <Card>
                <CardHeader
                    title="PO Details"
                    className={customStyle.cardHdr}
                    action={
                        <IconButton onClick={() => setFullWidthTbl(true)}>
                            <CgCompress />
                        </IconButton>
                    }
                />
                <form id="formPOHeader" onSubmit={saveChanges} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
                    <POActions
                        isDisabled={disableActions}
                        handleClickNewItem={handleClickNewItem}
                        handleClickCancel={handleClickCancel}
                        handlePrint={openPrintPreview}
                    // saveChanges={saveChanges}
                    />
                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={3}>
                            <Grid item lg={4}>
                                <POHeader poHdrData={poHdrData} clearValue={clearValue} setClearValue={setClearValue} />
                            </Grid>
                            <Grid item lg={8}>
                                <POSubDetails
                                    poId={selectedRow.length > 0 ? selectedRow[0] : null}
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

export const POForm = React.memo(Form);