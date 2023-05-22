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

function SupplierInfo(props) {
    const { clearValue, poHdrData } = props;

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
            organizationId: poHdrData.supplierId,
            organizationName: poHdrData.supplierName,
            address: poHdrData.supplierAddress,
            phone: poHdrData.supplierContact,
            email: poHdrData.supplierEmail
        })
    }, [poHdrData])

    return (
        <React.Fragment>
            <Box className={classes.fields}>
                <CentralizedTextField
                    id="supplierId"
                    name="supplierId"
                    label="Supplier Id"
                    value={orgDetails.organizationId || ""}
                    onClick={() => setOpenSelectOrg(true)}
                />
                <CentralizedTextField
                    id="supplierName"
                    name="supplierName"
                    label="Supplier Name"
                    value={orgDetails.organizationName || ""}
                    disabled
                />
                <CentralizedTextField
                    id="supplierAddress"
                    name="supplierAddress"
                    label="Supplier Address"
                    value={orgDetails.address || ""}
                    multiline
                    rows={2}
                    disabled
                />
                <CentralizedTextField
                    id="supplierContact"
                    name="supplierContact"
                    label="Supplier Contact #"
                    value={orgDetails.phone || ""}
                    disabled
                />
                <CentralizedTextField
                    id="supplierEmail"
                    name="supplierEmail"
                    label="Supplier Email"
                    value={orgDetails.email || ""}
                    disabled
                />
            </Box>
            <OrganizationSelectorDialog
                open={openSelectOrg}
                handleClose={() => setOpenSelectOrg(false)}
                orgType="SUPPLIER"
                setSelectedOrg={setOrgDetails}
            />
        </React.Fragment>
    )
}

SupplierInfo.propTypes = {
    clearValue: PropTypes.bool.isRequired
};

export const SupplierInfoForm = React.memo(SupplierInfo, (prevProps, nextProps) => {
    if((prevProps.clearValue === nextProps.clearValue) && (prevProps.poHdrData === nextProps.poHdrData)) {
        return true;
    }

    return false;
});