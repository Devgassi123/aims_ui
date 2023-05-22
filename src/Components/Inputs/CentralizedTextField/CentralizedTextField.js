import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

export default function CentralizedTextField(props) {
    return (
        <TextField
            variant='filled'
            size="small"
            margin="dense"
            InputLabelProps={{ shrink: true }}
            fullWidth
            {...props}
        />
    )
}

CentralizedTextField.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    // type: PropTypes.oneOf["number", "date"],
    // variant: PropTypes.oneOf["outlined", "standard"]
}