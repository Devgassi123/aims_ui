import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import moment from 'moment';
import { makeStyles } from "@material-ui/core/styles";
import {
    Card, CardContent, CardHeader,
    Grid,
    Typography,
} from '@material-ui/core';
import { useToasts } from "react-toast-notifications";

//API
import { productAPI } from '../../../../../redux/api/api';
// FUNCTIONS
import { useCustomStyle } from "../../../../../Functions/CustomStyle";
import { populateFields } from '../../../../../Functions/Util';
import { sessUser } from '../../../../Utils/SessionStorageItems';
// COMPONENTS
import ProductListActions from './ProductListAction';
import FileImage from "../FileImage";
import { BasicInfoForm } from './ProductBasicInfoForm';
import { UniqueInfoForm } from './ProductUniqueInfoForm';
import { DimensionInfoForm } from './ProductDimensionForm';
import { ProductPricingForm } from './ProductPricing';
import { CustomFieldsForm } from './ProductCustomFields';

const useStyles = makeStyles((theme) => ({
    cardContent: {
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
    fields: {
        "& > *": {
            margin: theme.spacing(.50, 0),
        },
    }
}));

const initialProductValues = {
    sku: "",
    productName: "",
    description: "",
    productCategoryId: "",
    productCategoryId2: "",
    productCategoryId3: "",
    barcode: "",
    barcode2: "",
    barcode3: "",
    barcode4: "",
    uniqueRfid: "",
    qrCode: "",
    uomRef: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    cubic: "",
    grossWeight: "",
    netWeight: "",
    image: "",
    captureTag: 0,
    dateCreated: "",
    dateModified: "",
    createdBy: "",
    modifiedBy: "",
};

var customFieldDetails;
function Form({ selectedRow, setRowSelected, setReload, userAllowedActions }) {
    const customStyle = useCustomStyle();
    const classes = useStyles();
    const { addToast } = useToasts();

    const [disableActions, setDisableActions] = useState(true);
    const [productDetails, setProductDetails] = useState({ ...initialProductValues });
    const [clearValue, setClearValue] = useState(false);

    useEffect(() => {
        let timeout;
        if (clearValue) {
            timeout = setTimeout(() => {
                setClearValue(false)
            }, 1000)
        }

        return () => clearTimeout(timeout);
    }, [clearValue])

    useEffect(() => {
        if (selectedRow.length > 0) {
            getProductDetails()
        }
        else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRow]);

    const resetForm = () => {
        const form = document.querySelector('#formProduct');
        form.reset();

        customFieldDetails = {};
        setProductDetails({ ...initialProductValues });
        setClearValue(true);
        setDisableActions(true);
    };

    const getProductDetails = async () => {
        try {
            const result = await productAPI().getbyid(selectedRow[0]);
            if (result.status === 200) {
                if (result.data.code === 0) {
                    resetForm();
                    addToast(result.data.message, {
                        appearance: "error"
                    });
                }
                else {
                    populateFields(result.data.data.product);
                    setProductDetails(result.data.data.product);
                    result.data.data.productPricing && populateFields(result.data.data.productPricing);
                    populateFields(result.data.data.prodUfields);
                    customFieldDetails = result.data.data.prodUfields;
                }

            }
        } catch (error) {
            addToast("Error occurred in getting product details!\n" + error, {
                appearance: "error"
            })
        }
    };

    const dataFormatter = (obj) => {
        return {
            product: {
                sku: String(obj.sku.replace(/[^a-zA-Z0-9-]/g, '')).toUpperCase(),
                productName: obj.productName === "" ? null : obj.productName,
                description: obj.description === "" ? null : obj.description,
                productCategoryId: obj.productCategoryId === "" ? null : obj.productCategoryId,
                productCategoryId2: obj.productCategoryId2 === "" ? null : obj.productCategoryId2,
                productCategoryId3: obj.productCategoryId3 === "" ? null : obj.productCategoryId3,
                image: obj.image === "" ? null : obj.image,
                length: obj.length === "" ? null : obj.length,
                width: obj.width === "" ? null : obj.width,
                height: obj.height === "" ? null : obj.height,
                cubic: obj.cubic === "" ? null : obj.cubic,
                grossWeight: obj.grossWeight === "" ? null : obj.grossWeight,
                netWeight: obj.netWeight === "" ? null : obj.netWeight,
                barcode: obj.barcode === "" ? null : obj.barcode,
                barcode2: obj.barcode2 === "" ? null : obj.barcode2,
                barcode3: obj.barcode3 === "" ? null : obj.barcode3,
                barcode4: obj.barcode4 === "" ? null : obj.barcode4,
                uniqueRfid: obj.uniqueRfid === "" ? null : obj.uniqueRfid,
                qrCode: obj.qrCode === "" ? null : obj.qrCode,
                uomRef: obj.uomRef === "" ? null : obj.uomRef,
                createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
                modifiedBy: sessUser,
                dateCreated: obj.dateCreated === "" ? moment(new Date()).format('YYYY-MM-DDTHH:mm') : moment(obj.dateCreated).format('YYYY-MM-DDTHH:mm'),
                dateModified: moment(new Date()).format('YYYY-MM-DDTHH:mm')
            },
            productPricing: {
                sku: String(obj.sku.replace(/[^a-zA-Z0-9-]/g, '')).toUpperCase(),
                cost: Number(obj.cost),
                retailPrice: Number(obj.retailPrice),
                wholeSalePrice: Number(obj.wholeSalePrice),
                discountedPrice: Number(obj.discountedPrice)
            },
            prodUfields: {
                ...customFieldDetails,
                sku: String(obj.sku.replace(/[^a-zA-Z0-9-]/g, '')).toUpperCase()
            }
        }
    };

    const saveProductImages = async (img_links) => {
        // const finalValues = {...productDetails, image: Buffer.from(img_links).toString('base64')}
        const finalValues = dataFormatter({ ...productDetails, image: img_links });

        try {
            const result = await productAPI().update(finalValues);
            if (result.status === 200) {
                if (result.data.code === 0) {
                    addToast(result.data.message, {
                        appearance: "error"
                    })
                }
                else {
                    addToast("Saved successfully!", {
                        appearance: "success"
                    })
                }
            }
        } catch (error) {
            addToast(`Error occurred in saving product details!\n${error}`, {
                appearance: "error"
            })
        }
    };

    const handleClickNew = () => {
        setRowSelected([])
    };

    const handleClickSave = async (event) => {
        event.preventDefault();

        var form = event.currentTarget;
        var serializedForm = serialize(form, { hash: true, empty: true, disabled: true });
        const finalValues = await dataFormatter(serializedForm);

        if (String(finalValues.sku).replace(/\s/g, '').replace(/-/g, '').replace(/_/g, '').length === 0) {
            addToast("Invalid SKU.", {
                appearance: "error",
            });
            return;
        }

        try {
            let result;
            if (selectedRow.length > 0) {
                if (!userAllowedActions[0].actions.includes("MOD")) {
                    addToast("You are not allowed to use update action.", {
                        appearance: "error",
                    });
                    return;
                }

                result = await productAPI().update(finalValues);
            }
            else {
                if (!userAllowedActions[0].actions.includes("ADD")) {
                    addToast("You are not allowed to use add action.", {
                        appearance: "error",
                    });
                    return;
                }

                result = await productAPI().create(finalValues);
            }

            if (result.status === 200) {
                if (result.data.code === 0) {
                    setDisableActions(false);
                    addToast(result.data.message, {
                        appearance: "error"
                    })
                }
                else {
                    setReload(true);
                    setRowSelected([]);
                    addToast("Saved successfully!", {
                        appearance: "success"
                    })
                }
            }
        } catch (error) {
            setDisableActions(false);
            addToast(`Error occurred in saving product details!\n${error}`, {
                appearance: "error"
            })
        }
    };

    const handleClickCancel = () => {
        setDisableActions(true);
        if (selectedRow.length > 0) {
            getProductDetails()
        }
        else {
            resetForm()
        }

        addToast("Transaction Cancelled", {
            appearance: "info",
        });
    };

    const handleInputChange = (event) => {
        setDisableActions(false);
    };

    const handleCustFieldValueChange = (event, custFields) => {
        const { id, value } = event.target;

        if (Object.keys(customFieldDetails).length === 0) customFieldDetails = custFields;
        customFieldDetails[id] = value === "" ? null : value
        setDisableActions(false);
    };

    return (
        <Card>
            <CardHeader title="Details" className={customStyle.cardHdr} />
            <form id="formProduct" onSubmit={handleClickSave}>
                <ProductListActions
                    isDisabled={disableActions}
                    handleClickNew={handleClickNew}
                    handleClickCancel={handleClickCancel}
                />
                <CardContent className={classes.cardContent}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} className={classes.fields}>
                            <BasicInfoForm
                                basicInfo={productDetails}
                                onChange={handleInputChange}
                                clearValue={clearValue}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>
                                Picture
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <FileImage sku={productDetails.sku} image={productDetails.image || ""} onSaveImage={saveProductImages} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.fields}>
                            <DimensionInfoForm
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.fields}>
                            <UniqueInfoForm
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.fields}>
                            <ProductPricingForm
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.fields}>
                            <CustomFieldsForm
                                onChange={handleCustFieldValueChange}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </form>
        </Card>
    );
};

Form.propTypes = {
    selectedRow: PropTypes.array.isRequired,
    setRowSelected: PropTypes.func.isRequired,
    userAllowedActions: PropTypes.array.isRequired
};

export const ProductListForm = React.memo(Form, (prevProps, nextProps) => {
    if (prevProps.selectedRow === nextProps.selectedRow) {
        return true;
    }
    return false;
});