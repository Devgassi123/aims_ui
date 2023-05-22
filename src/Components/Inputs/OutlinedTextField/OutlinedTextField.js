//This component was created due of lag when typing in input fields.
//Sadly, when using useState and you have many input fields (10 up), there's an obvious lag when typing in input fields.
//Because the old process was onChange of input field, the useState will be called to update the value which causing to re-render all the fields.
//Another problem is when use the useRef process, you can manipulate the date\a of input fields thru useRef but there's a bug in MUI which the label is not shrinking
//when there's a value and still in shrink if you clear the value.
//If this bug can be fixed, this component shall no longer use.

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

export default function CustomOutlinedTextField({id, name, label, rows, inputRef, defaultValue, clearValue, setClearValue, maxLength, isRequired, helperText, setDisableActionBtns}) {
    const [value, setValue] = useState("");

    useEffect(() => {
        if(defaultValue) {
            setValue(defaultValue);
        }
    }, [defaultValue])

    useEffect(()=> {
        if(clearValue) {
            setValue("");
            setClearValue(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clearValue])

    const handleOnChange = (event) => {
        const { value } = event.target;

        setValue(value.slice(0, maxLength));
        setDisableActionBtns(false);
    }

    return (
        <TextField
            id={id}
            name={name}
            label={label}
            
            size="small"
            rows={rows} 
            multiline={rows > 1 ? true : false}
            helperText={helperText}
            value={value}
            inputRef={inputRef}
            required={isRequired} 
            onChange={handleOnChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
        />
    )
}

CustomOutlinedTextField.propTypes = {
    id: PropTypes.string.isRequired, 
    name: PropTypes.string.isRequired, 
    label: PropTypes.string.isRequired, 
    rows: PropTypes.number,
    inputRef: PropTypes.any.isRequired, 
    defaultValue: PropTypes.any.isRequired, 
    clearValue: PropTypes.bool.isRequired, 
    setClearValue: PropTypes.func.isRequired, 
    maxLength: PropTypes.number.isRequired, 
    isRequired: PropTypes.bool.isRequired, 
    helperText: PropTypes.string, 
    setDisableActionBtns: PropTypes.func.isRequired
}