import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';

function Position({ positionInfo, setPositionInfo, setDisableActions }) {

    const onChangeDetails = (event) => {
        setDisableActions(false);
    };

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>Position</Typography>
            <CentralizedTextField
                id="validationCode"
                name="validationCode"
                label="Validation Code"
                defaultValue="*"
                helperText="will be auto-generated by system"
                disabled
                // onChange={onChangeDetails}
                // required
            />
            <CentralizedTextField
                id="aisleCode"
                name="aisleCode"
                label="Aisle Code"
                onChange={onChangeDetails}
                // required
            />
            <CentralizedTextField
                id="bayCode"
                name="bayCode"
                label="Bay Code"
                onChange={onChangeDetails}
                // required
            />
        </React.Fragment>
    );
}

Position.propTypes = {
    positionInfo: PropTypes.object.isRequired,
    setPositionInfo: PropTypes.func.isRequired,
    setDisableActions: PropTypes.func.isRequired,
};

export const PositionForm = React.memo(Position, (prevProps, nextProps) => {
    if (prevProps.positionInfo === nextProps.positionInfo) {
        return true;
    }
    return false;
});