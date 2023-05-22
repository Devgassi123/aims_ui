import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Box,
    InputAdornment,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Toolbar, Typography
} from '@material-ui/core';
import {
    Search as SearchIcon
} from '@material-ui/icons';
import { useToasts } from 'react-toast-notifications';
// API
import { locationAPI } from '../../redux/api/api';
// FUNCTIONS
import { CenteralUIColor } from "../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../Functions/Util";
// COMPONENTS
import { TableLoad } from "../Layout/Loader";
import NoData from "../NoData/NoData";
import Pagination from '../Pagination/Pagination';

const headCells = [
    { id: 'row', numeric: false, disablePadding: true, label: 'Row' },
    { id: 'locationId', numeric: false, disablePadding: false, label: 'Location ID' },
    { id: 'locationName', numeric: false, disablePadding: false, label: 'Location Name' },
    { id: 'locationTypeId', numeric: false, disablePadding: false, label: 'Type' },
    { id: 'locationGroupId', numeric: false, disablePadding: false, label: 'Group' },
    { id: 'areaId', numeric: false, disablePadding: false, label: 'Area' }
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead >
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'checkbox' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        backgroundColor: CenteralUIColor.LightestBrown
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { onSearch } = props;

    const searchRef = useRef(null)

    return (
        <Toolbar
            className={clsx(classes.root)}
        >
            <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                Locations
            </Typography>

            <Box display="flex">
                <Box mr={1}>
                    <TextField
                        id="txtSearch"
                        label="Search"
                        variant="outlined"
                        size="small"
                        margin="dense"
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                        }}
                        inputRef={searchRef}
                        onKeyDown={(event) => onSearch(event)}
                        style={{ backgroundColor: "white" }}
                    />
                </Box>
            </Box>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    tableContainer: {
        minHeight: 500,
        maxHeight: 500

    },
    pagination: {
        borderTop: "0.1px solid #ccc",
    }
}));

var initialPagination = {
    count: 0,
    currentPage: 1,
    totalPages: 1,
    rowFrom: 0,
    rowTo: 0,
    pageSize: 100,
    fromSearch: false
}

function EnhancedTable(props) {
    const { rowSelected, setRowSelected, locationType, onDblClick } = props;
    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('locationId');
    const [loading, setLoading] = React.useState(true);
    const [pagination, setPagination] = useState({ ...initialPagination })
    const [reload, setReload] = useState(true);

    var searchedKeyword = "";

    useEffect(() => {
        let isMounted = true;

        if (reload) {
            (async () => {
                if (!isMounted) return
                setLoading(true)
                try {
                    const result = await locationAPI().getAggregate(pagination, searchedKeyword,
                        {
                            locationTypeId: locationType === "ALL" ? null : locationType,
                            locationGroupId: null,
                            areaId: null,
                            inactive: 0,
                            aisleCode: null,
                            bayCode: null
                        }
                    )
                    if (result.status === 200) {
                        if (result.data.data) {
                            if (!isMounted) return;
                            setRows(result.data.data.location);
                            setPagination({ ...result.data.data.pagination, fromSearch: false });
                        }
                        else {
                            if (!isMounted) return;
                            setRows([]);
                            setPagination({ ...initialPagination })
                        }
                        if (!isMounted) return
                        setLoading(false);
                        setReload(false)
                    }
                } catch (error) {
                    addToast("Error occurred in getting locations!" + error, {
                        appearance: "error"
                    })
                    console.log("error", error)
                    if (!isMounted) return
                    setLoading(false);
                    setReload(false)
                }
            })();
        }

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [reload])

    const searchKeyword = async (keyWord) => {
        setLoading(true);
        setRowSelected([]);

        try {
            const result = await locationAPI().search(keyWord, pagination)
            if (result.status === 200) {
                if (result.data.data) {
                    setRows(result.data.data.locations)
                    setPagination({ ...result.data.data.pagination, fromSearch: true })
                }
                else {
                    setRows([]);
                    // setPagination({ ...initialPagination })
                }
                setLoading(false);
            }
        } catch (error) {
            addToast("Error occurred in searching!", {
                appearance: "error"
            })
        }

    };

    const onSearch = async (event) => {
        if (event.key === 'Enter') {
            if (event.target.value.replace(/\s/g, "").length > 0) {
                searchedKeyword = event.target.value;
                searchKeyword(event.target.value)
            }
            else {
                setReload(true)
            }
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleRowClick = (event, item) => {
        switch (event.detail) {
            case 1:
                const selectedIndex = rowSelected.findIndex((row) => row.locationId === item.locationId);
                let newSelected = [];

                if (selectedIndex === -1) {
                    newSelected = newSelected.concat(item);
                } else {
                    newSelected = [];
                }

                setRowSelected(newSelected);
                break;
            case 2:
                onDblClick(item)
                break;
            default:
                break;
        }


    };

    const isRowSelected = (id) => (rowSelected.findIndex((row) => row.locationId === id)) !== -1;

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar onSearch={onSearch} />
                <TableContainer className={classes.tableContainer}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        aria-label="locations table"
                        stickyHeader
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />

                        <TableBody>
                            {loading
                                ? <TableLoad count={20} cols={headCells.length + 1} />
                                : rows.length === 0
                                    ? <NoData cols={headCells.length + 1} />
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .map((row, index) => {
                                            const isRowItemSelected = isRowSelected(row.locationId);
                                            const labelId = `locations-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.locationId}
                                                    onClick={(event) => handleRowClick(event, row)}
                                                    selected={isRowItemSelected}
                                                >
                                                    <TableCell component="th" id={labelId} scope="row" padding='checkbox'>
                                                        {pagination.rowFrom + index}
                                                    </TableCell>
                                                    <TableCell align="left">{row.locationId}</TableCell>
                                                    <TableCell align="left">{row.locationName}</TableCell>
                                                    <TableCell align="left">{row.locationTypeId}</TableCell>
                                                    <TableCell align="left">{row.locationGroupId}</TableCell>
                                                    <TableCell align="left">{row.areaId}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                    pagination={pagination}
                    setPagination={setPagination}
                    isLoading={loading}
                    setReload={setReload}
                />
            </Paper>
        </div>
    );
}

EnhancedTable.propTypes = {
    validationCode: PropTypes.string.isRequired,
    rowSelected: PropTypes.array.isRequired,
    setRowSelected: PropTypes.func.isRequired,
    locationType: PropTypes.string.isRequired
};

export const LocationSelectorTable = React.memo(EnhancedTable);
