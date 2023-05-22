import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Grid,
    Typography,
} from '@material-ui/core';

import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';

const useStyles = makeStyles((theme) => ({
    grid: {
        padding: "4px 0px 0px 0px",
        justifyContent: "space-between"
    },
    gridItem1: {
        "& > *": {
            // margin: theme.spacing(.75, 0),
            maxWidth: "95%"
        },
        padding: "0px"
    },
    gridItem2: {
        "& > *": {
            // margin: theme.spacing(.75, 0),
            maxWidth: "100%",
        },
        alignContent: "right",
        padding: "0px"
    }
}));

function UniqueInfos({ onChange }) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Tagging Details
            </Typography>
            <Grid container className={classes.grid}>
                <Grid item md className={classes.gridItem1}>
                    <CentralizedTextField 
                        id="barcode"
                        name="barcode"
                        label="Barcode"
                        onChange={onChange}
                        inputProps={{
                            maxLength: 12
                        }}
                        required
                    />
                </Grid>
                <Grid item md className={classes.gridItem2}>
                    <CentralizedTextField 
                        id="barcode2"
                        name="barcode2"
                        label="Barcode 2"
                        onChange={onChange}
                        inputProps={{
                            maxLength: 12
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container className={classes.grid}>
                <Grid item md className={classes.gridItem1}>
                    <CentralizedTextField 
                        id="barcode3"
                        name="barcode3"
                        label="Barcode 3"
                        onChange={onChange}
                        inputProps={{
                            maxLength: 12
                        }}
                    />
                </Grid>
                <Grid item md className={classes.gridItem2}>
                    <CentralizedTextField 
                        id="barcode4"
                        name="barcode4"
                        label="Barcode 4"
                        onChange={onChange}
                        inputProps={{
                            maxLength: 12
                        }}
                    />
                </Grid>
            </Grid>
            <CentralizedTextField 
                id="uniqueRfid"
                name="uniqueRfid"
                label="RFID Code"
                onChange={onChange}
                inputProps={{
                    maxLength: 64
                }}
                // required
            />
            <CentralizedTextField 
                id="qrCode"
                name="qrCode"
                label="QR Code"
                onChange={onChange}
                inputProps={{
                    maxLength: 256
                }}
                // required
            />
        </React.Fragment>
    );
}

UniqueInfos.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export const UniqueInfoForm = React.memo(UniqueInfos, (prevProps, nextProps) => {
    if(prevProps.uniqueInfo === nextProps.uniqueInfo) {
        return true;
    }
    return false;
});