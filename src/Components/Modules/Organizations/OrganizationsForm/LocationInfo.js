import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

import CentralizedTextField from '../../../Inputs/CentralizedTextField/CentralizedTextField';

const useStyles = makeStyles((theme) => ({
    gridItem: {
        "& > *": {
            margin: theme.spacing(.75, 0),
            maxWidth: "96%"
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

function LocationInfo({ locationInfo, onChangeDetails }) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>Location Info</Typography>
            <CentralizedTextField
                id="address"
                name="address"
                label="Primary Address"
                multiline
                rows={2}
                defaultValue={locationInfo.address || ""}
                onChange={onChangeDetails}
                inputProps={{
                    maxLength: 200
                }}
            />
            <CentralizedTextField
                id="address2"
                name="address2"
                label="Secondary Address"
                multiline
                rows={2}
                defaultValue={locationInfo.address2 || ""}
                onChange={onChangeDetails}
                inputProps={{
                    maxLength: 200
                }}
            />
            <CentralizedTextField
                id="telephone"
                name="telephone"
                label="Telephone No."
                defaultValue={locationInfo.telephone || ""}
                onChange={onChangeDetails}
                inputProps={{
                    maxLength: 100
                }}
            />
            <CentralizedTextField
                id="phone"
                name="phone"
                label="Mobile No."
                defaultValue={locationInfo.phone || ""}
                onChange={onChangeDetails}
                inputProps={{
                    maxLength: 100
                }}
            />
            <CentralizedTextField
                id="email"
                name="email"
                label="Primary Email"
                defaultValue={locationInfo.email || ""}
                onChange={onChangeDetails}
                inputProps={{
                    maxLength: 100
                }}
            />
            <Grid container>
                <Grid item sm={12} md className={classes.gridItem}>
                    <CentralizedTextField
                        id="province"
                        name="province"
                        label="Province"
                        defaultValue={locationInfo.province || ""}
                        onChange={onChangeDetails}
                        inputProps={{
                            maxLength: 100
                        }}
                    />
                </Grid>
                <Grid item sm={12} md className={classes.gridItem}>
                    <CentralizedTextField
                        id="city"
                        name="city"
                        label="City"
                        defaultValue={locationInfo.city || ""}
                        onChange={onChangeDetails}
                        inputProps={{
                            maxLength: 100
                        }}
                    />
                </Grid>
                <Grid item sm={12} md className={classes.gridItem2}>
                    <CentralizedTextField
                        id="zipCode"
                        name="zipCode"
                        label="Zip Code"
                        defaultValue={locationInfo.zipCode || ""}
                        onChange={onChangeDetails}
                        inputProps={{
                            maxLength: 10
                        }}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

LocationInfo.propTypes = {
    locationInfo: PropTypes.object.isRequired,
    onChangeDetails: PropTypes.func.isRequired
};

export const LocationInfoForm = React.memo(LocationInfo, (prevProps, nextProps) => {
    if (prevProps.locationInfo === nextProps.locationInfo) {
        return true;
    }
    return false;
});