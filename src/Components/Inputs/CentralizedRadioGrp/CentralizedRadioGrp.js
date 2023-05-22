import React, { useEffect, useState } from "react";
import {
    FormControl, FormLabel, RadioGroup
} from '@material-ui/core';

export default function CentralizedRadioGrp(props) {
    const [val, setVal] = useState(props.defaultValue);

    useEffect(() => {
        if(typeof props.defaultValue === "number") {
            setVal(Number(props.defaultValue))
        }
        else {
            setVal(props.defaultValue)
        }
        
    }, [props.defaultValue])

    return (
        <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">{props.label}</FormLabel>
            <RadioGroup 
                row 
                aria-label={props.name} 
                name={props.name} 
                value={val} 
                onChange={(e) => {
                    if(typeof props.defaultValue === "number") {
                        setVal(Number(e.target.value))
                    }
                    else {
                        setVal(e.target.value)
                    }
                    props.onChange !== undefined && props.onChange(e)
                }}
            >
                {props.children}
            </RadioGroup>
        </FormControl>
    );
}