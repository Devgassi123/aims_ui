import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { TableRow, TableCell, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    autoCenter: {
        margin: "auto",
        width: "50%",
        // border: "3px solid green",
        borderBottom: "none",
        padding: theme.spacing(5),
        textAlign: "center"
    },
    typography: {
        marginTop: theme.spacing(2)
    }
}));

export default function NoData({cols}) {
    const classes = useStyles();

    return (
        <TableRow>
            <TableCell colSpan={cols || 5} className={classes.autoCenter}>
                {/* <img src={require("../../assets/img/box_open-close.gif")} alt="box" height={300} width={400}/> */}
                <img src={require("../../assets/img/transparent_box_open-close.gif")} alt="box" height={400} width={400}/>
                <Typography variant="h5" className={classes.typography} >Oops! No data found.</Typography>
            </TableCell>
        </TableRow>
    )
}