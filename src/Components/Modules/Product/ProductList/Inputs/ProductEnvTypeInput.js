import React, { useEffect, useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    margin: {
        marginBottom: theme.spacing(1),
    },
}));

const ProductEnvTypeInput = ({ selectProductEnvType, value, id, required }) => {
    const classes = useStyles();
    const [envTypes, setEnvTypes] = useState([]);

    useEffect(() => {
        setEnvTypes(["Type 1", "Type 2"]);
    }, []);

    return (
        <FormControl
            variant="filled"
            size="small"
            fullWidth
            className={classes.margin}
            required={required}
        >
            <InputLabel htmlFor={id}>Environment Type</InputLabel>
            <Select
                name={id}
                native
                value={value}
                onChange={selectProductEnvType}
                label="Environment Type"
                inputProps={{
                    name: id,
                    id: id,
                }}
                required={required}
            >
                <option value={0}>Select Type</option>
                {envTypes.map((row, index) => (
                    <option key={index} value={row.environmentTypeID}>
                        {row.environmentType}
                    </option>
                ))}
            </Select>
        </FormControl>
    );
};

export default ProductEnvTypeInput;
