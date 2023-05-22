import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography } from '@material-ui/core';


function Description({ descInfo, onChange }) {

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>Capacity</Typography>
            <TextField
                id="cubicCapacity"
                name="cubicCapacity"
                label="Cubic Capacity"
                variant="outlined"
                size="small"
                value={descInfo.cubicCapacity || ""}
                onChange={onChange}
                fullWidth
                required
            />
            <TextField
                id="weightCapacity"
                name="weightCapacity"
                label="Weight Capacity"
                variant="outlined"
                size="small"
                value={descInfo.weightCapacity || ""}
                onChange={onChange}
                fullWidth
                required
            />
            <TextField
                id="lenght"
                name="lenght"
                label="Length"
                variant="outlined"
                size="small"
                value={descInfo.lenght || ""}
                onChange={onChange}
                fullWidth
                required
            />
            <TextField
                id="width"
                name="width"
                label="Width"
                variant="outlined"
                size="small"
                value={descInfo.width || ""}
                onChange={onChange}
                fullWidth
                required
            />
        </React.Fragment>
    );
}

Description.propTypes = {
    descInfo: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export const DescriptionForm = React.memo(Description, (prevProps, nextProps) => {
    if (prevProps.otherInfo === nextProps.otherInfo) {
        return true;
    }
    return false;
});