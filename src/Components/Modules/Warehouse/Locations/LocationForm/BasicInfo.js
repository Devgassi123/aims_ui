import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { makeStyles } from "@material-ui/core/styles";
import { FormControlLabel, Grid, Radio, Typography } from '@material-ui/core';

//Components
import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import CentralizedRadioGrp from '../../../../Inputs/CentralizedRadioGrp/CentralizedRadioGrp';

import { AreaOptionBox, LocationTypeOptionBox, LocationGroupOptionBox } from '../../../../ReferenceOptionBox/ReferenceOptionBox';

const useStyles = makeStyles((theme) => ({
    fields: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
    },
    unecessaryFields: {
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
    },
    autoComplete: {
        marginTop: theme.spacing(.75)
    }
}));

function BasicInfos({ basicInfo, setDisableActions, clearValue }) {
    const classes = useStyles();

    const onChangeDetails = (event) => {
        setDisableActions(false);
    };

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>Basic Info</Typography>
            <CentralizedTextField
                id="locationId"
                name="locationId"
                label="Location ID"
                onChange={onChangeDetails}
                inputProps={{
                    maxLength: 50
                }}
                disabled={basicInfo.locationId.length > 0}
                required
            />
            <CentralizedTextField
                id="locationName"
                name="locationName"
                label="Location Name"
                onChange={onChangeDetails}
                inputProps={{
                    maxLength: 100
                }}
                required
            />
            <CentralizedTextField
                id="description"
                name="description"
                label="Description"
                onChange={onChangeDetails}
                inputProps={{
                    maxLength: 200
                }}
            />
            <LocationTypeOptionBox
                id="locationTypeId"
                name="locationTypeId"
                label="Location Type"
                defaultValue={basicInfo.locationTypeId}
                onChange={onChangeDetails}
                clearValue={clearValue}
                required
            />
            <AreaOptionBox
                id="areaId"
                name="areaId"
                label="Area"
                defaultValue={basicInfo.areaId}
                onChange={onChangeDetails}
                clearValue={clearValue}
                required
            />
            <LocationGroupOptionBox
                id="locationGroupId"
                name="locationGroupId"
                label="Location Group"
                defaultValue={basicInfo.locationGroupId}
                onChange={onChangeDetails}
                clearValue={clearValue}
                required
            />
            <CentralizedRadioGrp
                id="inactive"
                name="inactive"
                label="Inactive"
                defaultValue={basicInfo.inactive}
                onChange={onChangeDetails}
                clearValue={clearValue}
            >
                <FormControlLabel value={1} control={<Radio color="secondary" />} label="True" />
                <FormControlLabel value={0} control={<Radio color="secondary" />} label="False" />
            </CentralizedRadioGrp>
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
                        value={basicInfo.modifiedBy || ""}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem2}>
                    <CentralizedTextField
                        id="dateModified"
                        name="dateModified"
                        label="Date Modified"
                        // value={moment(basicInfo.dateModified).format('YYYY-MM-DDTHH:mm')}
                        disabled
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

BasicInfos.propTypes = {
    basicInfo: PropTypes.object.isRequired,
    setBasicInfo: PropTypes.func.isRequired,
    setDisableActions: PropTypes.func.isRequired,
    clearValue: PropTypes.bool.isRequired
};

export const BasicInfoForm = React.memo(BasicInfos, (prevProps, nextProps) => {
    if ((prevProps.basicInfo === nextProps.basicInfo) && (prevProps.clearValue === nextProps.clearValue)) {
        return true;
    }
    return false;
});

