import React from 'react';
import {
    Box, Button,
    Checkbox,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Slide,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ProductCategoryOptionBox, UOMRefOptionBox } from '../../../ReferenceOptionBox/ReferenceOptionBox';
import serialize from 'form-serialize';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function ProductListFilter(props) {
    const { open, handleClose, setReload, onFilter, filters, setFilters } = props;

    const [clearValue, setClearValue] = React.useState(false);

    React.useEffect(() => {
        let timeout;

        if (open) {
            if (clearValue) {
                timeout = setTimeout(() => {
                    setClearValue(false)
                }, 1000)
            }
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [open, clearValue]);

    const dataFormatter = async (obj) => {
        return new Promise((resolve, reject) => {
            // set as null the filters that were not ticked and the ones were ticked but no value 
            Object.keys(filters).forEach((key, index, array) => {
                if (obj[`chk${key}`] === "") {
                    obj[key] = null
                }
                else {
                    if (obj[key] === "") {
                        obj[key] = null
                    }
                }

                if (index === array.length - 1) resolve();
            })
        })
            .then(() => {
                // remove keys with "chk" which is value from checkboxes
                Object.keys(obj).forEach((key) =>
                    key.includes("chk") && delete obj[key]
                )
            })
            .then(() => {
                //check if all filters are null. If so, don't apply filter.
                if (Object.values(obj).every(val => val === null)) {
                    return {
                        ...obj,
                        applyFilter: false
                    }
                }

                return {
                    ...obj,
                    inactive: obj.inactive ? Number(obj.inactive) : null,
                    applyFilter: true
                };
            })
    };

    const applyFilter = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const serializedForm = serialize(form, { hash: true, disabled: true, empty: true });
        const finalValues = await dataFormatter(serializedForm)

        if (finalValues.applyFilter) {
            onFilter(finalValues);
        }

        handleClose();
    };

    const clearFilter = async () => {
        setFilters({
            uomRef: null,
            productCategoryId: null,
            productCategoryId2: null,
            productCategoryId3: null,
            applyFilter: false
        });
        setClearValue(true)
        setReload(true);
        handleClose()
    };

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth="xs"
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <form id="formPOFilter" onSubmit={applyFilter}>
                <DialogTitle id="alert-dialog-slide-title">
                    Filter Products
                </DialogTitle>
                <DialogContent>
                    <Alert severity="info">Tick the corresponding checkbox to apply the filter.</Alert>
                    {/* CATEGORY */}
                    <Box display="flex">
                        <ProductCategoryOptionBox
                            id="productCategoryIdFilter"
                            name="productCategoryId"
                            label="Product Category"
                            variant="outlined"
                            margin="dense"
                            clearValue={clearValue}
                        />
                        <Checkbox
                            id="chkproductCategoryId"
                            name="chkproductCategoryId"
                            color="secondary"
                            value
                        />
                    </Box>
                    {/* CATEGORY 2 */}
                    <Box display="flex">
                        <ProductCategoryOptionBox
                            id="productCategoryId2Filter"
                            name="productCategoryId2"
                            label="Product Category 2"
                            variant="outlined"
                            margin="dense"
                            clearValue={clearValue}
                        />
                        <Checkbox
                            id="chkproductCategoryId2"
                            name="chkproductCategoryId2"
                            color="secondary"
                            value
                        />
                    </Box>
                    {/* CATEGORY 3*/}
                    <Box display="flex">
                        <ProductCategoryOptionBox
                            id="productCategoryId3Filter"
                            name="productCategoryId3"
                            label="Product Category 3"
                            variant="outlined"
                            margin="dense"
                            clearValue={clearValue}
                        />
                        <Checkbox
                            id="chkproductCategoryId3"
                            name="chkproductCategoryId3"
                            color="secondary"
                            value
                        />
                    </Box>
                    {/* UOM */}
                    <Box display="flex">
                        <UOMRefOptionBox
                            id="uomRefFilter"
                            name="uomRef"
                            label="UOM"
                            variant="outlined"
                            margin="dense"
                            clearValue={clearValue}
                        />
                        <Checkbox
                            id="chkuomRef"
                            name="chkuomRef"
                            color="secondary"
                            value
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={clearFilter} color="default">
                        Clear Filter
                    </Button>
                    <Button onClick={handleClose} color="primary" type="submit">
                        Apply Filter
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
