import React from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Tab } from '@material-ui/core';
import { Tabs } from '@mui/material'

import { useCustomStyle } from '../../../../../../Functions/CustomStyle';

import { MainInfoForm } from './MainInfo';
import { WarehouseInfoForm } from './WarehouseInfoForm';
import { CarrierInfoForm } from '../../../PO/POHeader/CarrierInfo'

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        border: ".5px solid #ccc",
        height: "100%",
    },
    tabPanel: {

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
            {...other}
        >
            {/* {value === index && ( */}
            <Box px={2} py={0} className={classes.tabPanel}>
                {children}
            </Box>
            {/* )} */}
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

function Header(props) {
    const { transferHdrData, clearValue } = props;

    const classes = useStyles();
    const customStyle = useCustomStyle();
    const [currentTab, setCurrentTab] = React.useState(0);

    const handleChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Paper className={classes.root} elevation={0}>
            <Tabs
                value={currentTab}
                onChange={handleChange}
                TabIndicatorProps={{ className: customStyle.indicator }}
                // className={customStyle.tab}
                // textColor="primary"
                // variant='fullWidth'
                // centered
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="Main Info" {...a11yProps(0)} />
                <Tab label="Warehouse" {...a11yProps(1)} />
                <Tab label="Carrier" {...a11yProps(2)} />
                <Tab label="Custom Fields" {...a11yProps(3)} />
            </Tabs>
            <TabPanel value={currentTab} index={0}>
                <MainInfoForm />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <WarehouseInfoForm transferHdrData={transferHdrData} clearValue={clearValue} />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
                <CarrierInfoForm  docHdrData={transferHdrData} clearValue={clearValue} />
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
                
            </TabPanel>
        </Paper>
    );
}

export const ReceiveTransfersHeader = React.memo(Header)
