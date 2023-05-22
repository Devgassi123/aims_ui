import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
    Typography, TableCell
} from "@material-ui/core";

/* Grid List Size in Mobile and desktop for Module's Stage */
export const useCustomStyle = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    gridList: {
        [theme.breakpoints.up("sm")]: {
            height: "75vh",
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: "translateZ(0)",
            // border: "2px solid",
            // borderColor: "#430089",
        },
        [theme.breakpoints.down("sm")]: {
            height: "65vh",
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: "translateZ(0)",
            // border: "2px solid",
            // borderColor: "#430089",
        },
        padding: theme.spacing(2)
    },
    indicator: {
        backgroundColor: CenteralUIColor.LightBrown,
        marginBottom: theme.spacing(.5),
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    indicatorMUI5: {
        '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            marginBottom: theme.spacing(.5),
        },
        '& .MuiTabs-indicatorSpan': {
            maxWidth: 40,
            width: '100%',
            backgroundColor: CenteralUIColor.LightBrown,
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
        }
    },
    tab: {
        backgroundColor: CenteralUIColor.LightGrey,
        color: theme.palette.common.white,
    },
    activeModuleTab: {
        backgroundColor: CenteralUIColor.Grey,
        color: theme.palette.common.white,
        [theme.breakpoints.up("md")]: {
            maxWidth: "97vw"
        },
        [theme.breakpoints.up("lg")]: {
            maxWidth: "97vw"
        },
    },
    tblHead: {
        //can't use in sticky header table
        backgroundColor: CenteralUIColor.BrownTblHead,
    },
    colName: {
        color: CenteralUIColor.BrownTblHead,
        fontWeight: 1000
    },
    cardHdr: {
        backgroundColor: CenteralUIColor.LightestBrown,
        padding: theme.spacing(1.5, 2)
    },
    cardContent: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
        maxHeight: 508,
        overflow: "auto"
    },
    cardAction: {
        justifyContent: 'flex-end',
        "& > *": {
            width: "25%"
        }
    }
}));

export const CustomColorTypography = withStyles({
    root: {
        color: "#FFFFFF",
    },
})(Typography);

export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: CenteralUIColor.BrownTblHead,
        color: "white",
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

export const CenteralUIColor = {
    Orange: "#fe6335",
    DarkBlue: "#051622",
    HoverBlue: "rgba(255, 255, 255, 0.08)",
    Gold: "#DEB992",
    Black: "#000000",
    LiteOrange: "#ffccbc",
    DarkGrey: "#eeeeee",
    Brown: "#CDA678",
    LightBrown: "#d7ccc8",
    LightestBrown: "#efebe9",
    Blue: "#0d47a1",
    LightBlue: "#1976d2",
    Silver: "#C0C0C0",
    Grey: "#616161",
    LightGrey: "#757575",
    BrownTblHead: "#CDA678",
    IconColor: "#CBAB58",
    Yellow: "#ffeb3b",
    DrawerColor: "#3C4256"
};

