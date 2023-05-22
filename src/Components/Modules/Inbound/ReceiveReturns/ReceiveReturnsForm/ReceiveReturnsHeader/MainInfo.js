import React from 'react';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Box,
    Grid,
} from '@material-ui/core';

import CentralizedTextField from '../../../../../Inputs/CentralizedTextField/CentralizedTextField';

const useStyles = makeStyles((theme) => ({
    fields: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
    },
    grid: {
        padding: "0px 0px"
    },
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

function MainInfo(props) {
    const classes = useStyles();

    return (
        <Box className={classes.fields}>
            <CentralizedTextField
                id="returnsId"
                name="returnsId"
                label="Return No."
                helperText="New Return # will be auto-generated upon saving"
                disabled
            />
            <Box hidden={true}>
            <CentralizedTextField
                id="returnsStatusId"
                name="returnsStatusId"
                label="Return Status"
                disabled
                hidden
            />
            </Box>
            <CentralizedTextField
                id="refNumber"
                name="refNumber"
                label="Reference #"
                inputProps={{
                    maxLength: 50
                }}
            />
            <CentralizedTextField
                id="refNumber2"
                name="refNumber2"
                label="2nd Reference #"
                inputProps={{
                    maxLength: 50
                }}
            />
            <CentralizedTextField
                id="returnDate"
                name="arrivalDate"
                label="Return Date"
                type="date"
                required
            />
            <CentralizedTextField
                id="arrivalDate"
                name="arrivalDate2"
                label="Arrival Date"
                type="date"
            />
            <CentralizedTextField
                id="remarks"
                name="remarks"
                label="Remarks"
                inputProps={{
                    maxLength: 200
                }}
            />
            <Grid container className={classes.grid}>
                <Grid item xs={12} sm={12} md={5} lg={6} xl={6} className={classes.gridItem}>
                    <CentralizedTextField
                        id="createdBy"
                        name="createdBy"
                        label="Created By"
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem2}>
                    <CentralizedTextField
                        id="dateCreated"
                        name="dateCreated"
                        label="Date Created"
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container className={classes.grid}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem}>
                    <CentralizedTextField
                        id="modifiedBy"
                        name="modifiedBy"
                        label="Modified By"
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem2}>
                    <CentralizedTextField
                        id="dateModified"
                        name="dateModified"
                        label="Date Modified"
                        disabled
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

MainInfo.propTypes = {
    // formik: PropTypes.any.isRequired
};

export const MainInfoForm = React.memo(MainInfo);