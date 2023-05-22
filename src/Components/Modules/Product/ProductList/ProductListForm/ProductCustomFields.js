import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useToasts } from 'react-toast-notifications';

import {
    Typography,
} from '@material-ui/core';

import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import { productUserFieldsAPI } from '../../../../../redux/api/api';


function CustomFields({ onChange }) {
    const { addToast } = useToasts();
    const [customFields, setCustomFields] = useState({})

    useEffect(() => {
        let isMounted = true;

        const getProductCustFields = async () => {
            try {
                const result = await productUserFieldsAPI().getAll()
                if (result.status === 200) {
                    if (result.data.code === 1) {
                        isMounted && setCustomFields(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting custom fields!\n" + String(error), {
                    appearance: "error"
                })
            }

        }

        getProductCustFields()

        return () => isMounted = false;
    // eslint-disable-next-line
    }, [])

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Custom Fields
            </Typography>
            {Object.entries(customFields).map(([key, value], index) =>
                index > 0 && 
                    <CentralizedTextField
                        key={index}
                        id={key}
                        name={key}
                        label={key}
                        onChange={(e) => onChange(e, customFields)}
                        inputProps={{
                            maxLength: 255
                        }}
                    />
            )}
        </React.Fragment>
    );
}

CustomFields.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export const CustomFieldsForm = React.memo(CustomFields);