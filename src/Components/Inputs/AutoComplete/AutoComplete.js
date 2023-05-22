import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useEffect } from 'react';

function AutoComplete(props) {
    const { options, clearValue, ...otherProps } = props
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');

    useEffect(() => {
        if(clearValue) {
            setValue(null)
            setInputValue('')
        }
    }, [clearValue])

    return (
        <Autocomplete
            options={options}
            fullWidth
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) =>
                <TextField
                    {...params}
                    {...otherProps}
                    variant='outlined'
                    size="small"
                    margin='dense'
                />
            }
        />
    );
}

export const CentralizedAutoComplete = React.memo(AutoComplete, (prevProps, nextProps) => {
    if ((prevProps.options === nextProps.options) && (prevProps.clearValue === nextProps.clearValue)) {
        return true;
    }
    return false;
})
