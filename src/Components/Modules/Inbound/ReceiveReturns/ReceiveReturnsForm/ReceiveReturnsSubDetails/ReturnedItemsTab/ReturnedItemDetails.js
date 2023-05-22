import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, InputAdornment, Paper } from '@material-ui/core';
import { ListAlt as ListAltIcon } from '@material-ui/icons';

import CentralizedTextField from '../../../../../../Inputs/CentralizedTextField/CentralizedTextField';
import ItemSelectorDialog from '../../../../../../ItemSelector/ItemSelector';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: "100%",
        border: ".5px solid #ccc",
        padding: "10px",
        overflow: "auto"
    },
    fields: {
        "& > input": {
            margin: theme.spacing(1, 0),
        },
    },
    hide: {
        display: "none"
    }
}));

function Details(props) {
    const { selectedItem, clearValue } = props;

    const classes = useStyles();

    const [openSelectItem, setOpenSelectItem] = useState(false);
    const [selectedSKU, setSelectedSKU] = useState("")

    useEffect(() => {
        if (clearValue) {
            setSelectedSKU("")
        }
    }, [clearValue])

    return (
        <React.Fragment>
            <Paper className={classes.root} elevation={0}>
                <CentralizedTextField
                    id="sku"
                    name="sku"
                    label="SKU"
                    value={selectedSKU}
                    onChange={(event) => setSelectedSKU(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
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
                // required //commented to be able to save the returns without item details
                />
                <CentralizedTextField
                    id="expectedQty"
                    name="expectedQty"
                    label="Expected Qty."
                    type="number"
                    disabled={selectedItem.length > 0 && selectedItem[0].returnsLineStatusId !== "CREATED"}
                // required //commented to be able to save the returns without item details
                />
                <CentralizedTextField
                    id="qtyToReceived"
                    name="qtyToReceived"
                    label="Remaining Qty"
                    type="number"
                    disabled
                />
                <CentralizedTextField
                    id="poLineStatus"
                    name="poLineStatus"
                    label="Status"
                    disabled
                />
                <CentralizedTextField
                    id="returnsLineStatusId"
                    name="returnsLineStatusId"
                    label="Status ID"
                    disabled
                    className={classes.hide}
                />
                <CentralizedTextField
                    id="remarks2"
                    name="remarks2"
                    label="Remarks"
                />
                <CentralizedTextField
                    id="createdBy2"
                    name="createdBy2"
                    label="Created By"
                    disabled
                />
                <CentralizedTextField
                    id="dateCreated2"
                    name="dateCreated2"
                    label="Date Created"
                    disabled
                />
                <CentralizedTextField
                    id="modifiedBy2"
                    name="modifiedBy2"
                    label="Modified By"
                    disabled
                />
                <CentralizedTextField
                    id="dateModified2"
                    name="dateModified2"
                    label="Date Modified"
                    disabled
                />
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

export const ReturnedItemDetails = React.memo(Details)