import React, { useState, useEffect } from 'react';
import { alpha, makeStyles, withStyles } from "@material-ui/core/styles";
import { CardContent } from '@material-ui/core';
import { Card, CardHeader, IconButton, Link, Tooltip } from '@material-ui/core';
import {
    ChevronRight as ChevronRightIcon,
    ExpandMore as ExpandMoreIcon,
    FilterList as FilterListIcon,
    LocationOn as LocationOnIcon
} from "@material-ui/icons";
import { TreeItem, TreeView } from "@material-ui/lab";
import { IoFileTrayStackedSharp } from "react-icons/io5"

import { useCustomStyle } from "../../../../Functions/CustomStyle";
//API
import { locationAPI } from '../../../../redux/api/api';
//COMPONENT
import LocationsFilter from './LocationsFilter';
import { useToasts } from 'react-toast-notifications';

const useStyles = makeStyles((theme) => ({
    root: {
        height: 210,
        flexGrow: 1,
        maxWidth: 400,
    },
    cardContent: {
        "& > *": {
            margin: theme.spacing(.75, 0),
        },
        height: "100%",
        minHeight: 680,
        maxHeight: 680,
        overflow: "auto"
    },
}));

function LocationsTreeView({ selectedNode, setSelectedNode, reload, setReload }) {
    const customStyle = useCustomStyle();
    const classes = useStyles();

    const [openFilter, setOpenFilter] = useState(false);
    const [filters, setFilters] = useState({
        locationTypeId: null,
        locationGroupId: null,
        areaId: null,
        inactive: null,
        aisleCode: null,
        bayCode: null,
        applyFilter: false
    })

    const handleOpenFilter = () => {
        setOpenFilter(true);
    };

    const handleCloseFilter = () => {
        setOpenFilter(false);
    };

    const handleOnClickLabel = (locationID) => {
        setSelectedNode(locationID);
    };

    return (
        <React.Fragment>
            <LocationsFilter 
                open={openFilter} 
                handleClose={handleCloseFilter} 
                filters={filters}
                setFilters={setFilters}
                setReload={setReload}
            />
            <Card>
                <CardHeader
                    title="Locations"
                    className={customStyle.cardHdr}
                    action={
                        <Tooltip title="Filter list">
                            <IconButton aria-label="filter list" onClick={handleOpenFilter}>
                                <FilterListIcon htmlColor={filters.applyFilter ? "green" : "grey"} />
                            </IconButton>
                        </Tooltip>
                    }
                />
                <CardContent className={classes.cardContent}>
                    <TreeViewComponent 
                        funcOnClick={handleOnClickLabel} 
                        reload={reload}
                        setReload={setReload}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

const StyledTreeItem = withStyles((theme) => ({
    iconContainer: {
        "& .close": {
            opacity: 0.3,
        },
    },
    group: {
        marginLeft: 7,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
}))((props) => <TreeItem {...props} />);

function TreeViewComponent({ funcOnClick, reload, setReload, filters, setFilters }) {
    const classes = useStyles();
    const { addToast } = useToasts();

    const [treeLocations, setTreeLocations] = useState([]);
    const [defaultExpandedTreeView, setDefaultExpandedTreeView] = useState([]);
    let defaultExpandedGrps = [];

    useEffect(() => {
        let isMounted = true;

        async function getLocations() {
            try {
                const result = await locationAPI().getAll()
                if (result.status === 200) {
                    if (result.data.data) {
                        isMounted && treeViewConverter(result.data.data)
                    }
                    else {
                        isMounted && setTreeLocations([]);
                    }
                    isMounted && setReload(false);
                }
            } catch (error) {
                isMounted && setReload(false);
                addToast("Error occurred in getting locations!", {
                    appearance: "error"
                })
            }
        }

        if(reload) {
            getLocations()
        }
        
        return () => isMounted = false;
    // eslint-disable-next-line
    }, [reload])

    useEffect(() => {
        let isMounted = true;

        const getFilteredLocations = async () => {
            try {
                const result = await locationAPI().filter(filters)
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setTreeLocations([]);
                    }
                    else {
                        isMounted && treeViewConverter(result.data.data);
                    }
                    
                    if (!isMounted) return
                    setFilters(prev => ({...prev, applyFilter: false}));
                }
            } catch (error) {
                addToast("Error occurred in getting filtered locations!\n\n" + error, {
                    appearance: "error"
                })
                if (!isMounted) return
                setFilters(prev => ({...prev, applyFilter: false}));
            }
        }

        if (filters.applyFilter) {
            getFilteredLocations();
        }

        return () => isMounted = false;
    // eslint-disable-next-line
    }, [filters])

    const treeViewConverter = (locations) => {
        const locationGroups = locations.filter((ele, ind) => ind === locations.findIndex(elem => elem.locationGroupId === ele.locationGroupId && elem.locationGroupId === ele.locationGroupId));
        var tree = [];

        new Promise((resolve, reject) => {
            locationGroups.forEach((group, index) => {
                tree.push({
                    locationGroupId: group.locationGroupId,
                    locationGroupName: group.locationGroupId,
                    children: []
                })
                if (index === locationGroups.length - 1) resolve();
            })
        })
        .then(() => {
            locations.forEach((location) => {
                const parentIndex = tree.findIndex((parent) => parent.locationGroupId === location.locationGroupId)
                tree[parentIndex].children.push(location)
            })
        })
        .then(() => {
            setTreeLocations(tree);
        })

        // const tree = [{
        //     locationGroupID: 1,
        //     locationGroupName: 'Location Group 1',
        //     inactive: false,
        //     children: [{
        //         locationID: 1,
        //         locationName: 'Location 1',
        //         inactive: false,
        //         children: []
        //     }, {
        //         locationID: 2,
        //         locationName: 'Location 2',
        //         inactive: true,
        //         children: []
        //     }]
        // }];

        if (tree.length !== 0) {
            defaultExpandedMethod(tree); //<----- get all the location id that has children and set as default expanded
            setDefaultExpandedTreeView([...defaultExpandedGrps]);
        }
    };

    const renderTree = (nodes) => {
        return nodes.map((node, idx) => {
            return (
                <StyledTreeItem
                    key={idx}
                    nodeId={node.locationId === undefined
                        ? node.locationGroupName
                        : String(node.locationId)
                    }
                    label={node.locationId === undefined
                        ? <><IoFileTrayStackedSharp size="17px" /> {node.locationGroupName}</>
                        : treeLabel(node.locationId, node.locationName, node.inactive)
                    }
                >
                    {Array.isArray(node.children) ? renderTree(node.children) : null}
                </StyledTreeItem>
            );
        });
    };

    const treeLabel = (locationId, name, inactive) => (
        <Link
            color="inherit"
            onClick={(event) => {
                funcOnClick(locationId);

                // if you want after click do expand/collapse comment this two line
                event.stopPropagation();
                event.preventDefault();
            }}
        >
            {inactive === 1 ? (
                <LocationOnIcon
                    style={{ color: "red" }}
                    titleAccess="Deactivated Location"
                />
            ) : <LocationOnIcon
                style={{ color: "green" }}
                titleAccess="Active Location"
                />
            }
            {name}
        </Link>
    );

    const defaultExpandedMethod = (nodes) => {
        nodes.map((node => {
            if (node.locationGroupName !== undefined) {
                defaultExpandedGrps.push(node.locationGroupName);
                if (node.children.length !== 0) {
                    defaultExpandedMethod(node.children);
                }
            }
            return nodes;
        }));
    };

    const handleChange = (event, nodes) => {
        setDefaultExpandedTreeView(nodes);
    };

    if(treeLocations.length === 0) {
        return (
            <h3>No Locations found</h3>
        )
    }

    return (
        <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            expanded={defaultExpandedTreeView}
            onNodeToggle={handleChange}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {renderTree(treeLocations)}
        </TreeView>
    );
}

export default LocationsTreeView;