import React from 'react';
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    BottomNavigation,
    Paper,
    BottomNavigationAction,
    Box,
    Divider,
} from "@material-ui/core";
import {
    Add as AddIcon, Check as CheckIcon, Clear as ClearIcon,  Print as PrintIcon
    // ThumbUp as ThumbUpIcon 
} from '@material-ui/icons';

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
    },
    bottomNav: {
        "&:hover": {
            borderBottom: "2px solid red",
            borderRadius: "2px"
        }
    },
    colorGreen: {
        color: "green",
        fontWeight: 1000,
        "&:hover": {
            borderBottom: "2px solid green",
            borderRadius: "2px"
        }
    },
    colorRed: {
        color: "red",
        fontWeight: 1000,
        "&:hover": {
            borderBottom: "2px solid red",
            borderRadius: "2px"
        }
    },
    colorGrey: {
        color: "grey",
        fontWeight: 1000,
        "&:hover": {
            cursor: "not-allowed"
        }
       
    },
    mb4px: {
        marginBottom: "4px"
    }
}));

export default function POActions(props) {
    const { isDisabled, handleClickCancel, handleClickNewItem, handlePrint } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Box mt={0} mb={0} mr={0} ml={0} pt={0}>
                <Paper style={{ display: "flex" }}>
                    <BottomNavigation
                        showLabels
                        className={classes.root}
                    >
                        <BottomNavigationAction
                            label="ADD ITEM"
                            icon={<AddIcon color={"primary"} />}
                            onClick={handleClickNewItem}
                        // className={Number(allowedBtns[0]) === 0 ? classes.hidden : ""}
                        />
                        <BottomNavigationAction
                            label="SAVE"
                            type="submit"
                            icon={<CheckIcon htmlColor={isDisabled ? "#ccc" : "#2e7d32"} />}
                            disabled={isDisabled}
                            // onClick={saveChanges}
                        // className={Number(allowedBtns[0]) === 0 ? classes.hidden : ""}
                        />
                        <BottomNavigationAction
                            label="CANCEL"
                            icon={<ClearIcon htmlColor={isDisabled ? "#ccc" : "red"} />}
                            disabled={isDisabled}
                            onClick={handleClickCancel}
                        // className={Number(allowedBtns[1]) === 0 ? classes.hidden : ""}
                        />
                        <Divider orientation="vertical" flexItem />
                        <BottomNavigationAction
                            label="PRINT"
                            icon={<PrintIcon color={"primary"} />}
                            onClick={handlePrint}
                        // className={Number(allowedBtns[0]) === 0 ? classes.hidden : ""}
                        />
                    </BottomNavigation>
                </Paper>
            </Box>
        </div>
    );
}


