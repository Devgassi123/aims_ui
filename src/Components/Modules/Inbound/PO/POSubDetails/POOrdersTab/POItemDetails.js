import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, InputAdornment, Paper } from '@material-ui/core';

import CentralizedTextField from '../../../../../Inputs/CentralizedTextField/CentralizedTextField';
import ItemSelectorDialog from '../../../../../ItemSelector/ItemSelector';
import { ListAlt as ListAltIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: "100%",
        maxHeight: "100%",
        minHeight: "100%",
        border: ".5px solid #ccc",
        padding: "10px",
        overflow: "auto"
    },
    fields: {
        "& > input": {
            margin: theme.spacing(1, 0),
        },
    },
}));

export default function POItemDetails(props) {
    const { selectedItem, clearValue } = props;

    const classes = useStyles();

    const [openSelectItem, setOpenSelectItem] = useState(false);
    const [selectedSKU, setSelectedSKU] = useState("")

    useEffect(() => {
        if(clearValue) {
            setSelectedSKU("")
        }
    }, [clearValue])

    return (
        <React.Fragment>
            <Paper className={classes.root} elevation={0}>
                {/* <form className={classes.fields}> */}
                {/* <Grid container spacing={2} >
                    <Grid item md> */}
                        <CentralizedTextField
                            id="sku"
                            name="sku"
                            label="SKU"
                            value={selectedSKU}
                            onChange={(event) => setSelectedSKU(event.target.value)}
                            onKeyDown={(event) => {
                                if(event.key === "Enter") {
                                    // setSelectedSKU(event.target.value)
                                    setOpenSelectItem(true)
                                }
                            }}
                            InputProps={{
                                endAdornment: 
                                    <InputAdornment position="end">
                                        <IconButton edge='end' onClick={() => setOpenSelectItem(true)}>
                                            <ListAltIcon />
                                        </IconButton>
                                    </InputAdornment>
                            }}
                            autoFocus
                            disabled={selectedItem.length > 0}
                            // required //commented to be able to save the PO without order details
                        />
                    {/* </Grid>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="orderQty"
                            name="orderQty"
                            label="Order Qty."
                            type="number"
                            disabled={selectedItem.length > 0 && selectedItem[0].poLineStatusId !== "CREATED"}
                            // required //commented to be able to save the PO without order details
                        />
                    {/* </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="totalReceived"
                            name="totalReceived"
                            label="Total Received Qty."
                            type="number"
                            disabled
                        />
                    {/* </Grid>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="qtyToReceived"
                            name="qtyToReceived"
                            label="Remaining Qty"
                            type="number"
                            disabled
                        />
                    {/* </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="poLineStatusId"
                            name="poLineStatusId"
                            label="Status"
                            disabled
                        />
                    {/* </Grid>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="remarks2"
                            name="remarks2"
                            label="Remarks"
                        />
                    {/* </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="createdBy2"
                            name="createdBy2"
                            label="Created By"
                            disabled
                        />
                    {/* </Grid>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="dateCreated2"
                            name="dateCreated2"
                            label="Date Created"
                            disabled
                        />
                    {/* </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="modifiedBy2"
                            name="modifiedBy2"
                            label="Modified By"
                            disabled
                        />
                    {/* </Grid>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="dateModified2"
                            name="dateModified2"
                            label="Date Modified"
                            disabled
                        />
                    {/* </Grid>
                </Grid> */}
                {/* </form> */}
            </Paper>
            <ItemSelectorDialog
                open={openSelectItem}
                handleClose={() => setOpenSelectItem(false)}
                productId={selectedSKU}
                setProductID={setSelectedSKU}
            />
        </React.Fragment>
    )
}