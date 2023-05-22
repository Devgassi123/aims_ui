import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';

import CentralizedTextField from '../../../../../Inputs/CentralizedTextField/CentralizedTextField';
import OrganizationSelectorDialog from '../../../../../OrganizationSelector/OrganizationSelector';

const useStyles = makeStyles((theme) => ({
    fields: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
    },
    grid: {
        padding: "0px 0px"
    },
    gridItem: {
        "& > *": {
            margin: theme.spacing(.75, 0),
            maxWidth: "96%"
        },
        padding: "0px"
    },
    gridItem2: {
        "& > *": {
            margin: theme.spacing(.75, 0),
            maxWidth: "100%",
        },
        alignContent: "right",
        padding: "0px"
    }
}));

function ConsigneeInfo(props) {
    const { returnsHdrData, clearValue } = props;

    const classes = useStyles();

    const [openSelectOrg, setOpenSelectOrg] = React.useState(false)
    const [orgDetails, setOrgDetails] = React.useState({
        organizationId: "",
        organizationName: "",
        address: "",
        phone: "",
        email: ""
    })

    useEffect(() => {
        setOrgDetails({
            organizationId: returnsHdrData.storeId,
            organizationName: returnsHdrData.storeFrom,
            address: returnsHdrData.storeAddress,
            phone: returnsHdrData.storeContact,
            email: returnsHdrData.storeEmail
        })
    }, [returnsHdrData])

    useEffect(() => {
        if (clearValue) {
            setOrgDetails({
                organizationId: "",
                organizationName: "",
                address: "",
                phone: "",
                email: ""
            })
        }
    }, [clearValue])

    return (
        <React.Fragment>
            <Box className={classes.fields}>
                <CentralizedTextField
                    id="storeId"
                    name="storeId"
                    label="Consignee ID"
                    value={orgDetails.organizationId || ""} 
                    onClick={() => setOpenSelectOrg(true)}
                />
                <CentralizedTextField
                    id="storeFrom"
                    name="storeFrom"
                    label="Consignee Name"
                    value={orgDetails.organizationName || ""}
                    disabled
                />
                <CentralizedTextField
                    id="storeAddress"
                    name="storeAddress"
                    label="Consignee Address"
                    value={orgDetails.address || ""}
                    multiline
                    rows={2}
                    disabled
                />
                <CentralizedTextField
                    id="storeContact"
                    name="storeContact"
                    label="Consignee Contact #"
                    value={orgDetails.phone || ""}
                    disabled
                />
                <CentralizedTextField
                    id="storeEmail"
                    name="storeEmail"
                    label="Consignee Email"
                    value={orgDetails.email || ""}
                    disabled
                />
            </Box>
            <OrganizationSelectorDialog
                open={openSelectOrg}
                handleClose={() => setOpenSelectOrg(false)}
                orgType="CONSIGNEE"
                setSelectedOrg={setOrgDetails}
            />
        </React.Fragment>
    )
}

ConsigneeInfo.propTypes = {
    clearValue: PropTypes.bool.isRequired
};

export const ConsigneeInfoForm = React.memo(ConsigneeInfo, (prevProps, nextProps) => {
    if((prevProps.clearValue === nextProps.clearValue) && (prevProps.returnsHdrData === nextProps.returnsHdrData)) {
        return true;
    }

    return false;
});