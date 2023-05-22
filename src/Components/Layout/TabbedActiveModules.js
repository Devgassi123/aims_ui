import React, { useEffect, useState } from 'react';
import { useHistory, Route, Switch, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import {
    AppBar,
    Box,
    IconButton,
    Tabs, Toolbar
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons'
import clsx from 'clsx';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useToasts } from 'react-toast-notifications';

import { NavDiv } from "../Layout/Nav";
import { CenteralUIColor, useCustomStyle } from "../../Functions/CustomStyle";
import banner from "../../img/warehouse_bg.jpg";
// REDUX
import { useDispatch, useSelector } from 'react-redux';
import { removeFromActiveModules, setNewSequenceOfActiveModules } from '../../redux/actions/active_modules';
// UTILS
// import { convertToMd5 } from '../Utils/MD5Converter';
//COMPONENTS
import Organization from "../../Components/Modules/Organizations/Organizations";
import Warehouses from '../../Components/Modules/Warehouse/Warehouses/Warehouses';
import Area from "../Modules/Warehouse/Areas/Areas";
import Zones from "../Modules/Warehouse/Zones/Zones";
import LocationGroups from '../Modules/Warehouse/Location Groups/LocationGroups';
import Location from "../Modules/Warehouse/Locations/Locations";
import Category from "../Modules/Product/Category/Category";
import Product from "../Modules/Product/ProductList/ProductList";
import CompanyInfo from '../Modules/Setup/Basic Settings/Company Info/CompanyInfo';
import DocNo from '../Modules/Setup/Basic Settings/Doc No/DocNo';
import RoleInfo from '../Modules/Setup/Users/Role Info/RoleInfo';
import UserAccounts from '../Modules/Setup/Users/User Accounts/UserAccounts';
import AuditTrail from '../Modules/Logs/Audit Trail/AuditTrail';
import UOMRef from '../Modules/Setup/Basic Settings/UOM Ref/UOMRef';
import ProductConditions from '../Modules/Setup/Basic Settings/Product Conditions/ProductConditions';
import PrintSetup from '../Modules/Setup/Basic Settings/Print Setup/PrintSetup';
import PO from '../Modules/Inbound/PO/PO';
// import POHeaderAndDetailsRpt from '../Modules/Inbound/PO/POReport/POHeaderAndDetailsRpt';
import ReceiveReturns from '../Modules/Inbound/ReceiveReturns/ReceiveReturns';
import ReceiveTransfers from '../Modules/Inbound/ReceiveTransfers/ReceiveTransfers';

//REDUX ACTIONS
import { saveZoneDetails } from '../../redux/actions/zones';
import { BackdropLoad } from './Loader';
import { tokenAPI } from '../../redux/api/api';


const useStyles = makeStyles((theme) => ({
    rootBg: {
        // display: "flex",
        // flexGrow: 1,
        backgroundColor: "white",
        backgroundImage: "url(" + banner + ")",
        width: "100vw",
        maxWidth: "100vw",
        overflowY: "hidden",
        height: "100vh",
        backgroundPosition: "center",
        backgroundSize: "1000px 600px",
        backgroundRepeat: "no-repeat",
    },

    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,

    content: {
        flexGrow: 1,
        // marginTop: theme.spacing(-2) //necessary to override the space due of toolbar if not dense
    },
    hidden: {
        display: "none"
    },
    longTextStyle: {
        wordWrap: "break-word",
        maxWidth: 100,
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={1}>{children}</Box>}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        "aria-controls": `scrollable-auto-tabpanel-${index}`,
    };
};

// a little function to help us with reordering the result
function reorderTabs(modules, startIndex, endIndex) {
    const result = Array.from(modules);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getTabStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    // change background colour if dragging
    backgroundColor: isDragging ? CenteralUIColor.BrownTblHead : CenteralUIColor.Grey,
    // styles we need to apply on draggables
    ...draggableStyle,
});

function TabbedActiveModules(props) {
    const customStyle = useCustomStyle();
    const classes = useStyles();

    const userMenu = useSelector((state) => state.menuReducer.data);
    const active_modules = useSelector(state => state.activeModulesReducer);
    const dispatch = useDispatch();

    let history = useHistory();
    const location = useLocation();

    const { addToast } = useToasts();

    const [tabIndexValue, setTabIndexValue] = useState("");
    const [hoverModule, setHoverModule] = useState("");

    // useEffect(() => {
    // sessionStorage.setItem("user", JSON.stringify(convertToMd5("ADMIN")));
    // sessionStorage.setItem("role", JSON.stringify(convertToMd5("ADMIN")));
    localStorage.setItem("user", JSON.stringify("ADMIN"));
    localStorage.setItem("role", JSON.stringify("ADMIN"));
    // }, []);

    //get token
    useEffect(() => {
        (async () => {
            try {
                const result = await tokenAPI().getToken()
                if(result.status === 200) {
                    if(result.data.code === 0) {
                        addToast("Cannot get the API Token", {
                            appearance: "error"
                        })
                    }
                    else {
                        localStorage.setItem("apiToken", JSON.stringify(result.data.data.authToken));
                    }
                }
            } catch (error) {
                addToast(String(error), {
                    appearance: "error"
                })
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (active_modules.modules.length > 0) {
            setTabIndexValue(Number(active_modules.modules.findIndex((module) => module.moduleName === active_modules.selected_module)));
            handleTabClick(active_modules.selected_module);
        } else {
            setTabIndexValue(0);
            history.push("/");
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active_modules.modules, active_modules.selected_module]);

    const handleTabChange = (event, newValue) => {
        setTabIndexValue(Number(newValue));
    };

    const handleRemoveTab = (event, moduleName) => {
        dispatch(removeFromActiveModules(moduleName));

        switch (moduleName) {
            case 'Zones':
                dispatch(saveZoneDetails(null));
                break;

            default:
                break;
        }
    };

    const handleTabClick = (tabName) => {
        if (tabName === "Locations") {
            history.push("/warehouse/locations");
        } else if (tabName === "Categories") {
            history.push("/product/categories");
        } else if (tabName === "Basic Settings") {
            history.push("/setup/basic_settings");
        } else if (tabName === "Vendors") {
            history.push("/organization/vendors");
        } else if (tabName === "Product List") {
            history.push("/product/product_list");
        } else if (tabName === "Bill of Materials") {
            history.push("/product/bill_of_materials");
        } else if (tabName === "Product Pricing") {
            history.push("/product/pricing");
        } else if (tabName === "Users") {
            history.push("/setup/users");
        } else if (tabName === "Organizations") {
            history.push("/organizations");
        } else if (tabName === "Warehouse Info") {
            history.push("/warehouse");
        } else if (tabName === "Areas") {
            history.push("/warehouse/areas");
        } else if (tabName === "Zones") {
            history.push("/warehouse/zones");
        } else if (tabName === "Location Groups") {
            history.push("/warehouse/location_groups");
        } else if (tabName === "Company Info") {
            history.push("/setup/basic_settings/company_info");
        } else if (tabName === "UOM Ref") {
            history.push("/setup/basic_settings/uom_ref");
        } else if (tabName === "Product Conditions") {
            history.push("/setup/basic_settings/product_conditions");
        } else if (tabName === "Print Setup") {
            history.push("/setup/basic_settings/print_setup");
        } else if (tabName === "Document No.") {
            history.push("/setup/basic_settings/doc_no");
        } else if (tabName === "Role Info") {
            history.push("/setup/users/role_info");
        } else if (tabName === "User Accounts") {
            history.push("/setup/users/accounts");
        } else if (tabName === "Audit Trail") {
            history.push("/logs/audit_trail");
        } else if (tabName === "Purchase Order") {
            history.push("/inbound/po");
        } else if (tabName === "Receive Returns") {
            history.push("/inbound/receive_returns");
        } else if (tabName === "Receive Transfer") {
            history.push("/inbound/receive_transfers");
        }
    };

    const handleOnDragEnd = (result) => {
        const { destination, source } = result;
        //drop outside of the Droppable Context
        if (!destination) {
            return;
        }

        //dropped on the same location
        if ((destination.droppableId === source.droppableId) && (destination.index === source.index)) {
            return;
        }

        const newSeqActiveModules = reorderTabs(
            active_modules.modules,
            source.index,
            destination.index
        );

        dispatch(setNewSequenceOfActiveModules(newSeqActiveModules));
    };

    const loopTab = (activeModules) => {
        return (
            activeModules.map((module, idx) =>
                <Draggable key={module.id} draggableId={module.id} index={idx}>
                    {(provided, snapshot) => (
                        <Box
                            display="flex"
                            width={150}
                            padding={1}
                            mr={2}
                            onMouseEnter={() => setHoverModule(module.moduleName)}
                            onMouseLeave={() => setHoverModule("")}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getTabStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                            )}
                            {...a11yProps(idx)}
                        >
                            <Box flexGrow={1} mt={.5} onClick={() => handleTabClick(module.moduleName)}>
                                {module.moduleName}
                            </Box>
                            <Box ml={2}>
                                <IconButton
                                    size="small"
                                    className={
                                        clsx({
                                            [classes.hidden]: (tabIndexValue !== idx) && (module.moduleName !== hoverModule)
                                        })}
                                    onClick={(e) => handleRemoveTab(e, module.moduleName)}
                                >
                                    <CloseIcon htmlColor="white" />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Draggable>
            )
        )
    };

    return (
        <div className={clsx(customStyle.root, { [classes.rootBg]: location.pathname === "/" })}>
            <NavDiv />
            <main className={classes.content}>
                <Toolbar variant="dense" />
                <AppBar position="static">
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="droppableTab" direction="horizontal">
                            {(provided, snapshot) => (
                                <Tabs
                                    innerRef={provided.innerRef}
                                    value={tabIndexValue}
                                    onChange={handleTabChange}
                                    TabIndicatorProps={{ className: customStyle.indicator }}
                                    variant="scrollable"
                                    scrollButtons="on"
                                    aria-label="Active Modules Tab"
                                    className={customStyle.activeModuleTab}
                                    // style={getTabStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                >
                                    {active_modules.modules.length > 0 && loopTab(active_modules.modules)}
                                    {provided.placeholder}
                                </Tabs>
                            )}
                        </Droppable>
                    </DragDropContext>
                </AppBar>

                {userMenu.length === 0
                    ? <BackdropLoad show={userMenu.length === 0} />
                    :
                    <Switch>
                        <Route path="/organizations" component={Organization} />
                        <Route path="/warehouse" component={Warehouses} exact />
                        <Route path="/warehouse/areas" component={Area} />
                        <Route path="/warehouse/zones" component={Zones} />
                        <Route path="/warehouse/location_groups" component={LocationGroups} />
                        <Route path="/warehouse/locations" render={props => <Location {...props} />} />
                        <Route path="/product/categories" component={Category} />
                        <Route path="/product/product_list" component={Product} />
                        <Route path="/setup/basic_settings/company_info" component={CompanyInfo} />
                        <Route path="/setup/basic_settings/doc_no" component={DocNo} />
                        <Route path="/setup/basic_settings/uom_ref" component={UOMRef} />
                        <Route path="/setup/basic_settings/product_conditions" component={ProductConditions} />
                        <Route path="/setup/basic_settings/print_setup" component={PrintSetup} />
                        <Route path="/setup/users/role_info" component={RoleInfo} />
                        <Route path="/setup/users/accounts" component={UserAccounts} />
                        <Route path="/logs/audit_trail" component={AuditTrail} />
                        <Route path="/inbound/po" component={PO} />
                        <Route path="/inbound/receive_returns" component={ReceiveReturns} />
                        <Route path="/inbound/receive_transfers" component={ReceiveTransfers} />
                    </Switch>
                }
            </main>
        </div>
    );
}

export default TabbedActiveModules;