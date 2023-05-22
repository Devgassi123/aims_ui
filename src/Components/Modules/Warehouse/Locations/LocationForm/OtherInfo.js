import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    autoComplete:{
        marginTop: theme.spacing(.75)
    }
}))

function Others({ otherInfo, onChange }) {
    const classes = useStyles;

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>Other Infos</Typography>
            <TextField
                id="validationCode"
                name="validationCode"
                label="Validation Code"
                variant="outlined"
                size="small"
                value={otherInfo.validationCode || "*"}
                // onChange={onChange}
                helperText="Validation Code is auto-generated"
                fullWidth
                disabled
                // required
            />
            <Autocomplete
                id="locationUseTypeID"
                name="locationUseTypeID"
                options={[]}
                getOptionLabel={(option) => option.areaName}
                renderInput={
                    (params) => 
                        <TextField
                            {...params}
                            label="Use Type"
                            variant="outlined"
                            size="small"
                            required
                            className={classes.autoComplete}
                        />
                }
            />
            <TextField
                id="locationControlID"
                name="locationControlID"
                label="Control ID"
                variant="outlined"
                size="small"
                value={otherInfo.locationControlID || ""}
                onChange={onChange}
                fullWidth
                required
            />
            <Autocomplete
                id="locationCategoryID"
                name="locationCategoryID"
                options={[]}
                getOptionLabel={(option) => option.areaName}
                renderInput={
                    (params) => 
                        <TextField
                            {...params}
                            label="Category"
                            variant="outlined"
                            size="small"
                            required
                            className={classes.autoComplete}
                        />
                }
            />
        </React.Fragment>
    );
}

Others.propTypes = {
    otherInfo: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export const OthersForm = React.memo(Others, (prevProps, nextProps) => {
    if (prevProps.otherInfo === nextProps.otherInfo) {
        return true;
    }
    return false;
});