import React from "react";
import PropTypes from "prop-types";
import { Backdrop, CircularProgress, Typography, Box, TableRow, TableCell } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import { CenteralUIColor } from "../../Functions/CustomStyle";

const variants = [
    { id: 1, variant: "h1" },
    { id: 2, variant: "h3" },
    { id: 3, variant: "body1" },
    { id: 4, variant: "caption" },
    { id: 5, variant: "h3" },
    { id: 6, variant: "body1" },
    { id: 7, variant: "caption" },
];

const useStyles = makeStyles((theme) => ({
    skeletonColor: {
        backgroundColor: CenteralUIColor.HoverBlue,
        marginBottom: theme.spacing(2)
    },
    cellPadding: {
        padding: theme.spacing(0, 1)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularProgress: {
        position: "relative",
        top: "8em",
        marginRight: theme.spacing(3),
        color: "#a3e1f0"
    },
    loadingText: {
        margin: theme.spacing(0),
        padding: theme.spacing(0),
        fontWeight: 100,
        fontSize: "2.1em",
        color: "#a3e1f0",
        fontFamily: `'Arial Narrow', sans-serif`,
        letterSpacing: "0.2em"
    },
    span: {
        position: "relative",
        top: "0.63em",
        display: "inline-block",
        textTransform: "uppercase",
        opacity: 0,
        transform: "rotateX(-90deg)",
    },
    let1: {
        animation: `$drop 1.2s infinite ${theme.transitions.easing.easeInOut}`,
        animationDelay: "1.2s"
    },
    let2: {
        animation: `$drop 1.2s infinite ${theme.transitions.easing.easeInOut}`,
        animationDelay: "1.3s"
    },
    let3: {
        animation: `$drop 1.2s infinite ${theme.transitions.easing.easeInOut}`,
        animationDelay: "1.4s"
    },
    let4: {
        animation: `$drop 1.2s infinite ${theme.transitions.easing.easeInOut}`,
        animationDelay: "1.5s"
    },
    let5: {
        animation: `$drop 1.2s infinite ${theme.transitions.easing.easeInOut}`,
        animationDelay: "1.6s"
    },
    let6: {
        animation: `$drop 1.2s infinite ${theme.transitions.easing.easeInOut}`,
        animationDelay: "1.7s"
    },
    let7: {
        animation: `$drop 1.2s infinite ${theme.transitions.easing.easeInOut}`,
        animationDelay: "1.8s"
    },
    "@keyframes drop": {
        "10%": {
            opacity: 0.5
        },
        "20%": {
            opacity: 1,
            top: "3.78em",
            transform: "rotateX(-360deg)"
        },
        "80%": {
            opacity: 1,
            top: "3.78em",
            transform: "rotateX(-360deg)"
        },
        "90%": {
            opacity: 0.5
        },
        "100%": {
            opacity: 0,
            top: "6.94em"
        }
    }
}));

export function TypographyLoad() {
    const classes = useStyles();
    return (
        <div>
            <Box p={1}>
                {variants.map((variant) => (
                    <Typography
                        component="div"
                        key={variant.id}
                        variant={variant.variant}
                    >
                        <Skeleton className={classes.skeletonColor} />
                    </Typography>
                ))}
            </Box>
        </div>
    );
}

TypographyLoad.propTypes = {
    loading: PropTypes.bool,
};

export function IconMenuLoad() {
    const classes = useStyles();
    const arraySkeleton = [];

    for (var i = 1; i <= 13; i++) {
        arraySkeleton.push(
            <Skeleton key={i} variant="circle" width={40} height={40} className={classes.skeletonColor} />
        )
    }

    return (
        <Box p={1}>
            {arraySkeleton}
        </Box>
    )
}

export function TableLoad(props) {
    const { count, cols } = props;
    const arraySkeleton = [];
    const classes = useStyles();

    for (var i = 1; i <= count; i++) {
        arraySkeleton.push(
            <TableRow key={i}>
                <TableCell colSpan={cols} className={classes.cellPadding}>
                    <Skeleton animation="wave" height={40} width="100%" />
                </TableCell>
            </TableRow>
        )
    }

    return arraySkeleton;
}

TableLoad.propTypes = {
    count: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired
};

export function BackdropLoad(props) {
    const { show } = props;

    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={show}>
            <Box display="flex">
                <CircularProgress className={classes.circularProgress} />
                <h1 className={classes.loadingText}>
                    <span className={clsx(classes.span, classes.let1)}>l</span>
                    <span className={clsx(classes.span, classes.let2)}>o</span>
                    <span className={clsx(classes.span, classes.let3)}>a</span>
                    <span className={clsx(classes.span, classes.let4)}>d</span>
                    <span className={clsx(classes.span, classes.let5)}>i</span>
                    <span className={clsx(classes.span, classes.let6)}>n</span>
                    <span className={clsx(classes.span, classes.let7)}>g</span>
                </h1>
            </Box>
        </Backdrop>
    )
}

BackdropLoad.propTypes = {
    show: PropTypes.bool.isRequired
};