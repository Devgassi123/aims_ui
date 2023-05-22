import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, } from '@material-ui/core';

import { useCustomStyle } from "../../../../Functions/CustomStyle";

const useStyles = makeStyles((theme) => ({
    root: {
        height: 210,
        flexGrow: 1,
        maxWidth: 400,
    },
    card: {
        width: "100%",
        minWidth: "100%"
    },
    cardContent: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
        height: "100%",
        minHeight: 693,
        maxHeight: 693,
        minWidth: "100%",
        overflow: "auto"
    },
    floatRight: {
        float: "right"
    },
    alert: {
        marginBottom: theme.spacing(3)
    },
    block: {
        display: "inline-block",
        width: "100%",
        minWidth: "100%"
    }
}));

function AuditTrailDetails(props) {
    const { data } = props;

    const customStyle = useCustomStyle();
    const classes = useStyles();

    // const [json, setJson] = useState({OrganizationId: "string", "OrganizationName":"string","OrganizationTypeID":"CARRIER","Address":"string","Address2":"string","Telephone":"string","Phone":"string","Email":"string","Province":"string","City":"string","ZipCode":"string","Inactive":0,"DateCreated":"2022-06-23T06:22:15.849Z","DateModified":"2022-06-23T06:22:15.849Z","CreatedBy":"string","ModifiedBy":"string","Remarks":"string"})
    
    return (
        <Card className={classes.card}>
            <CardHeader
                title="Data"
                className={customStyle.cardHdr}
            />
            <CardContent className={classes.cardContent}>
                {data.length > 0 && Object.entries(JSON.parse(data[0].data)).map(([key, value], idx) =>
                    <span key={idx} className={classes.block}>{key} : {value}</span>
                )}
            </CardContent>
        </Card>
    )
}

export const MemoizedAuditTrailDetails = React.memo(AuditTrailDetails)
