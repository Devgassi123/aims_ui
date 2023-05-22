import React from 'react';
import PropTypes from 'prop-types';
import {
    InputAdornment,
    Typography,
} from '@material-ui/core';

import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';

function ProductPricing({ onChange }) {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Pricing
            </Typography>
            <CentralizedTextField 
                id="cost"
                name="cost"
                label="Cost"
                type="number"
                onChange={onChange}
                InputProps={{
                    startAdornment: <InputAdornment position="start">₱</InputAdornment>
                }}
            />
            <CentralizedTextField 
                id="retailPrice"
                name="retailPrice"
                label="Retail Price"
                type="number"
                onChange={onChange}
                InputProps={{
                    startAdornment: <InputAdornment position="start">₱</InputAdornment>
                }}
            />
            <CentralizedTextField 
                id="wholeSalePrice"
                name="wholeSalePrice"
                label="Wholesale Price"
                type="number"
                onChange={onChange}
                InputProps={{
                    startAdornment: <InputAdornment position="start">₱</InputAdornment>
                }}
            />
            <CentralizedTextField 
                id="discountedPrice"
                name="discountedPrice"
                label="Discounted Price"
                type="number"
                onChange={onChange}
                InputProps={{
                    startAdornment: <InputAdornment position="start">₱</InputAdornment>
                }}
            />
        </React.Fragment>
    );
}

ProductPricing.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export const ProductPricingForm = React.memo(ProductPricing, (prevProps, nextProps) => {
    if (prevProps.pricing === nextProps.pricing) {
        return true;
    }
    return false;
});