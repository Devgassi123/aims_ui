import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    FormControlLabel,
    Grid, MenuItem,
    Radio,
    Typography
} from '@material-ui/core';

import CentralizedTextField from '../../../Inputs/CentralizedTextField/CentralizedTextField';
import CentralizedSelectBox from '../../../Inputs/CentralizedSelectBox/CentalizedSelectBox';
import CentralizedRadioGrp from '../../../Inputs/CentralizedRadioGrp/CentralizedRadioGrp';

const useStyles = makeStyles((theme) => ({
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

function BasicInfo({ basicInfo, onChangeDetails, clearValue }) {

    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>Basic Info</Typography>
            <CentralizedTextField
                id="organizationId"
                name="organizationId"
                label="Organization ID"
                onChange={onChangeDetails}
                helperText="Spaces and symbols will be removed upon saving"
                inputProps={{
                    minLength: 3,
                    maxLength: 50
                }}
                disabled={basicInfo.organizationId.length > 0}
                required
            />
            <CentralizedTextField
                id="organizationName"
                name="organizationName"
                label="Organization Name"
                onChange={onChangeDetails}
                inputProps={{
                    maxLength: 100
                }}
                required
            />
            <CentralizedSelectBox
                id="organizationTypeID"
                name="organizationTypeID"
                label="Organization Type"
                defaultValue={basicInfo.organizationTypeID || ""}
                onChange={onChangeDetails}
                clearValue={clearValue}
                required
            >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="CARRIER">Carrier</MenuItem>
                <MenuItem value="CONSIGNEE">Consignee</MenuItem>
                <MenuItem value="SUPPLIER">Supplier</MenuItem>
            </CentralizedSelectBox>

            <CentralizedRadioGrp
                id="inactive"
                name="inactive"
                label="Inactive"
                defaultValue={basicInfo.inactive}
                onChange={onChangeDetails}
            >
                <FormControlLabel value={1} control={<Radio color="secondary" />} label="Yes" />
                <FormControlLabel value={0} control={<Radio color="secondary" />} label="No" />
            </CentralizedRadioGrp>

            <CentralizedTextField
                id="remarks"
                name="remarks"
                label="Remarks"
                onChange={onChangeDetails}
                multiline
                rows={2}
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
        </React.Fragment>
    );
}

BasicInfo.propTypes = {
    basicInfo: PropTypes.object.isRequired,
    onChangeDetails: PropTypes.func.isRequired
};

export const BasicInfoForm = React.memo(BasicInfo, (prevProps, nextProps) => {
    if ((prevProps.basicInfo === nextProps.basicInfo) && (prevProps.clearValue === nextProps.clearValue)) {
        return true;
    }
    return false;
});