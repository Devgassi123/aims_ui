import React from 'react';
import PropTypes from 'prop-types';
import {
    Typography,
} from '@material-ui/core';

import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';

function DimensionInfos({ onChange }) {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Dimension
            </Typography>
            <CentralizedTextField 
                id="length"
                name="length"
                label="Length"
                onChange={onChange}
                inputProps={{
                    maxLength: 10
                }}
            />
            <CentralizedTextField 
                id="width"
                name="width"
                label="Width"
                onChange={onChange}
                inputProps={{
                    maxLength: 10
                }}
            />
            <CentralizedTextField 
                id="height"
                name="height"
                label="Height"
                onChange={onChange}
                inputProps={{
                    maxLength: 50
                }}
            />
            <CentralizedTextField 
                id="cubic"
                name="cubic"
                label="Cubic"
                onChange={onChange}
                inputProps={{
                    maxLength: 45
                }}
            />
            <CentralizedTextField 
                id="grossWeight"
                name="grossWeight"
                label="Gross Weight"
                onChange={onChange}
                inputProps={{
                    maxLength: 45
                }}
            />
            <CentralizedTextField 
                id="netWeight"
                name="netWeight"
                label="Net Weight"
                onChange={onChange}
                inputProps={{
                    maxLength: 45
                }}
            />
        </React.Fragment>
    );
}

DimensionInfos.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export const DimensionInfoForm = React.memo(DimensionInfos, (prevProps, nextProps) => {
    if (prevProps.dimension === nextProps.dimension) {
        return true;
    }
    return false;
});