import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';

import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import OrganizationSelectorDialog from '../../../../OrganizationSelector/OrganizationSelector';

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

function CarrierInfo(props) {
    const { clearValue, docHdrData } = props;

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

    useEffect(() => {
        setOrgDetails({
            organizationId: docHdrData.carrierId,
            organizationName: docHdrData.carrierName,
            address: docHdrData.carrierAddress,
            phone: docHdrData.carrierContact,
            email: docHdrData.carrierEmail
        })
    }, [docHdrData])

    return (
        <React.Fragment>
            <Box className={classes.fields}>
                <CentralizedTextField
                    id="carrierId"
                    name="carrierId"
                    label="Carrier Id"
                    value={orgDetails.organizationId || ""}
                    onClick={() => setOpenSelectOrg(true)}
                />
                <CentralizedTextField
                    id="carrierName"
                    name="carrierName"
                    label="Carrier Name"
                    value={orgDetails.organizationName || ""}
                    disabled
                />
                <CentralizedTextField
                    id="carrierAddress"
                    name="carrierAddress"
                    label="Carrier Address"
                    value={orgDetails.address || ""}
                    multiline
                    rows={2}
                    disabled
                />
                <CentralizedTextField
                    id="carrierContact"
                    name="carrierContact"
                    label="Carrier Contact #"
                    value={orgDetails.phone || ""}
                    disabled
                />
                <CentralizedTextField
                    id="carrierEmail"
                    name="carrierEmail"
                    label="Carrier Email"
                    value={orgDetails.email || ""}
                    disabled
                />
            </Box>
            <OrganizationSelectorDialog
                open={openSelectOrg}
                handleClose={() => setOpenSelectOrg(false)}
                orgType="CARRIER"
                setSelectedOrg={setOrgDetails}
            />
        </React.Fragment>
    )
}

CarrierInfo.propTypes = {
    clearValue: PropTypes.bool.isRequired
    // poHdrData: PropTypes
    // onChangeDetails: PropTypes.func.isRequired
};

export const CarrierInfoForm = React.memo(CarrierInfo, (prevProps, nextProps) => {
    if((prevProps.clearValue === nextProps.clearValue) && (prevProps.docHdrData === nextProps.docHdrData)) {
        return true;
    }

    return false;
});