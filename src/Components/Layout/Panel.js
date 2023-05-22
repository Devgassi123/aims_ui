
import { makeStyles } from "@material-ui/core/styles";
import {Typography,Paper} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    maxWidth: 936,
    margin: "auto",
    overflow: "hidden",
  },
  contentWrapper: {
    margin: "40px 16px",
  },
}));

const Panel = (props) => {
    const {children} = props;
    const classes = useStyles();
    return (
      <Paper className={classes.paper}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Quantity on hand
        </Typography>
        <Typography component="p" variant="h4">
          $3,024.00
        </Typography>
        <div className={classes.contentWrapper}>
          <Typography color="textSecondary" align="center">
            No users for this project yet
          </Typography>
        </div>
      </Paper>
    );
}

export default Panel;

