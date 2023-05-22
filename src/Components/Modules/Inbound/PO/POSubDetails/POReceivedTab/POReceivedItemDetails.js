import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

import CentralizedTextField from '../../../../../Inputs/CentralizedTextField/CentralizedTextField';

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
}));

export default function POReceivedItemDetails(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Paper className={classes.root} elevation={0}>
                {/* <form className={classes.fields}> */}
                {/* <Grid container spacing={2} >
                    <Grid item md> */}
                        <CentralizedTextField
                            id="rcv_sku"
                            name="rcv_sku"
                            label="SKU"
                            disabled
                        />
                    {/* </Grid>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="rcv_orderQty"
                            name="rcv_orderQty"
                            label="Order Qty."
                            type="number"
                            disabled
                        />
                    {/* </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="rcv_totalReceived"
                            name="rcv_totalReceived"
                            label="Total Received Qty."
                            type="number"
                            disabled
                        />
                    {/* </Grid>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="rcv_qtyToReceived"
                            name="rcv_qtyToReceived"
                            label="Remaining Qty"
                            type="number"
                            disabled
                        />
                    {/* </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="rcv_poLineStatusId"
                            name="rcv_poLineStatusId"
                            label="Status"
                            disabled
                        />
                    {/* </Grid>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="rcv_remarks2"
                            name="rcv_remarks2"
                            label="Remarks"
                            disabled
                        />
                    {/* </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="rcv_createdBy2"
                            name="rcv_createdBy2"
                            label="Created By"
                            disabled
                        />
                    {/* </Grid>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="rcv_dateCreated2"
                            name="rcv_dateCreated2"
                            label="Date Created"
                            disabled
                        />
                    {/* </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="rcv_modifiedBy2"
                            name="rcv_modifiedBy2"
                            label="Modified By"
                            disabled
                        />
                    {/* </Grid>
                    <Grid item md> */}
                        <CentralizedTextField
                            id="rcv_dateModified2"
                            name="rcv_dateModified2"
                            label="Date Modified"
                            disabled
                        />
                    {/* </Grid>
                </Grid> */}
                {/* </form> */}
            </Paper>
        </React.Fragment>
    )
}