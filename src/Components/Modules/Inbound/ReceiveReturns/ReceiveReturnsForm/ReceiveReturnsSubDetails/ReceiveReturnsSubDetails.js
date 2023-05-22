import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Paper, Tab } from '@material-ui/core'
import { Tabs } from '@mui/material';

import { useCustomStyle } from '../../../../../../Functions/CustomStyle';

import { populateFields } from '../../../../../../Functions/Util';
import { useRef } from 'react';
import { ReturnedItemsTable } from './ReturnedItemsTab/ReturnedItemsTable';
import { ReturnedItemDetails } from './ReturnedItemsTab/ReturnedItemDetails';
import { POReceivedTable } from '../../../PO/POSubDetails/POReceivedTab/POReceivedTable';

// import POReceivedItemDetails from './POReceivedTab/POReceivedItemDetails';

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: ".5px solid #ccc"
    },
    tabPanel: {
        height: "100%",
        overflow: "auto"
    },
    tabPanelContent: {
        display: "flex",
        height: "100%",
        overflow: "auto"
    }
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    const classes = useStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className={classes.tabPanel}
            {...other}
        >
            {value === index && (
                <Box px={2} py={1} className={classes.tabPanelContent}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function SubDetails(props) {
    const { returnsId, hideItemDetails, setHideItemDetails, selectedItem, setSelectedItem, clearValue, setReloadHdrTable, setSoftReloadHdrTable } = props;

    const classes = useStyles();
    const customStyle = useCustomStyle();

    const tabRef = useRef();

    const [reload, setReload] = useState(true);
    const [currentTab, setCurrentTab] = React.useState(0);

    const handleChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    useEffect(() => {
        if (selectedItem.length === 0) {
            populateFields({
                sku: "",
                expectedQty: 0,
                totalReceived: 0,
                qtyToReceived: 0,
                poLineStatus: "",
                returnsLineStatusId: "",
                dateCreated2: "",
                dateModified2: "",
                createdBy2: "",
                modifiedBy2: "",
                remarks2: ""
            })
        }
        else {
            populateFields({
                sku: selectedItem[0].sku,
                expectedQty: selectedItem[0].expectedQty,
                totalReceived: selectedItem[0].totalReceived,
                qtyToReceived: selectedItem[0].qtyToReceived,
                poLineStatus: selectedItem[0].poLineStatus,
                returnsLineStatusId: selectedItem[0].returnsLineStatusId,
                dateCreated2: selectedItem[0].dateCreated,
                dateModified2: selectedItem[0].dateModified,
                createdBy2: selectedItem[0].createdBy,
                modifiedBy2: selectedItem[0].modifiedBy,
                remarks2: selectedItem[0].remarks
            })
        }
    }, [selectedItem])

    return (
        <React.Fragment>
            <Paper className={classes.root} elevation={0}>
                <Tabs
                    action={tabRef}
                    value={currentTab}
                    onChange={handleChange}
                    // className={customStyle.indicatorMUI5}
                    TabIndicatorProps={{ className: customStyle.indicator }}
                    // TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Return Item Details" {...a11yProps(0)} />
                    <Tab label="Received Items" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={currentTab} index={0}>
                    <Grid container spacing={2}>
                        <Grid item md={8}>
                            <ReturnedItemsTable
                                returnsId={returnsId}
                                rowSelected={selectedItem}
                                setRowSelected={setSelectedItem}
                                reload={reload}
                                setReload={setReload}
                                collapse={hideItemDetails}
                                setHideItemDetails={setHideItemDetails}
                                setReloadHdrTable={setReloadHdrTable}
                                setSoftReloadHdrTable={setSoftReloadHdrTable}
                            />
                        </Grid>
                        <Grid item md={4}>
                            <ReturnedItemDetails
                                selectedItem={selectedItem}
                                setSelectedItem={setSelectedItem}
                                clearValue={clearValue}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={currentTab} index={1}>
                    <POReceivedTable
                        documentNo={returnsId}
                        documentType="RETURNS"
                        rowSelected={selectedItem}
                        setRowSelected={setSelectedItem}
                        reload={reload}
                        setReload={setReload}
                        setHideItemDetails={setHideItemDetails}
                        setReloadHdrTable={setReloadHdrTable}
                        setSoftReloadHdrTable={setSoftReloadHdrTable}
                    />
                </TabPanel>
            </Paper>
        </React.Fragment>

    )
}

export const ReceiveReturnsSubDetails = React.memo(SubDetails);