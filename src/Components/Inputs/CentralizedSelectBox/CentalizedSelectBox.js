import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';

export default function CentralizedSelectBox(props) {
    const { children, clearValue, onChange, ...otherProps } = props
    const [val, setVal] = useState("");

    useEffect(() => {
        // console.log("props.defaultValue = ", props.defaultValue)
        if(props.defaultValue !== undefined) setVal(props.defaultValue || "")
    }, [props.defaultValue])

    useEffect(() => {
        if(clearValue) {
            setVal("");
        }
    }, [clearValue])

    return ( 
        <TextField
            value={val}
            onChange={(event) => {
                setVal(event.target.value)
                if(onChange !== undefined) onChange(event)
            }}
            variant='filled'
            size="small"
            // InputLabelProps={{ shrink: true }}
            select
            fullWidth
            {...otherProps} 
        >
            {children}
        </TextField>
    )
}