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

function WarehouseInfo(props) {
    const { transferHdrData, clearValue } = props;

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
            organizationId: transferHdrData.whFromId,
            organizationName: transferHdrData.whFrom,
            address: transferHdrData.whFromAddress,
            phone: transferHdrData.whFromContact,
            email: transferHdrData.whFromEmail
        })
    }, [transferHdrData])

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
                    id="whFromId"
                    name="whFromId"
                    label="Warehouse ID"
                    value={orgDetails.organizationId || ""}
                    onClick={() => setOpenSelectOrg(true)}
                />
                <CentralizedTextField
                    id="whFrom"
                    name="whFrom"
                    label="Warehouse Name"
                    value={orgDetails.organizationName || ""}
                    disabled
                />
                <CentralizedTextField
                    id="whFromAddress"
                    name="whFromAddress"
                    label="Warehouse Address"
                    value={orgDetails.address || ""}
                    multiline
                    rows={2}
                    disabled
                />
                <CentralizedTextField
                    id="whFromContact"
                    name="whFromContact"
                    label="Warehouse Contact #"
                    value={orgDetails.phone || ""}
                    disabled
                />
                <CentralizedTextField
                    id="whFromEmail"
                    name="whFromEmail"
                    label="Warehouse Email"
                    value={orgDetails.email || ""}
                    disabled
                />
            </Box>
            <OrganizationSelectorDialog
                open={openSelectOrg}
                handleClose={() => setOpenSelectOrg(false)}
                orgType="WAREHOUSE"
                setSelectedOrg={setOrgDetails}
            />
        </React.Fragment>
    )
}

WarehouseInfo.propTypes = {
    clearValue: PropTypes.bool.isRequired
};

export const WarehouseInfoForm = React.memo(WarehouseInfo, (prevProps, nextProps) => {
    if((prevProps.clearValue === nextProps.clearValue) && (prevProps.transferHdrData === nextProps.transferHdrData)) {
        return true;
    }

    return false;
});