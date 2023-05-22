import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  BottomNavigation,
  Paper,
  BottomNavigationAction,
  Box,
} from "@material-ui/core";
import { Add as AddIcon, Check as CheckIcon,  Clear as ClearIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing(3),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    hidden: {
        display: "none"
    },
    typography: {
        // margin: theme.spacing(3),
        padding: theme.spacing(2)
    }
}));

export default function OrganizationActions(props){
    const { isDisabled, handleClickNew, handleClickCancel } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Box mt={0} mb={0} mr={0} ml={0} pt={0}>
                <Paper>
                    <BottomNavigation
                        showLabels
                        className={classes.root}
                    >
                        <BottomNavigationAction
                            label="NEW"
                            icon={<AddIcon color={"primary"}/>}
                            onClick={handleClickNew}
                            // className={Number(allowedBtns[0]) === 0 ? classes.hidden : ""}
                        />
                        {/* <Divider orientation="vertical" flexItem/> */}
                        <BottomNavigationAction
                            label="SAVE"
                            type="submit"
                            icon={<CheckIcon color={isDisabled ? "disabled" : "primary"}/>}
                            disabled={isDisabled}
                            // className={Number(allowedBtns[0]) === 0 ? classes.hidden : ""}
                        />
                        <BottomNavigationAction
                            label="CANCEL"
                            icon={<ClearIcon color={isDisabled ? "disabled" : "primary"}/>}
                            disabled={isDisabled}
                            onClick={handleClickCancel}
                            // className={Number(allowedBtns[1]) === 0 ? classes.hidden : ""}
                        />
                    </BottomNavigation> 
                </Paper>
            </Box>
        </div>
  );
}


