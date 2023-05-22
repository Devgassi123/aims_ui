import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Badge,
    Box,
    Checkbox,
    IconButton,
    InputAdornment,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography
} from '@material-ui/core';
import {
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Delete as DeleteIcon,
    FilterList as FilterListIcon,
    Search as SearchIcon
} from '@material-ui/icons';
import swal from 'sweetalert';
import { useToasts } from 'react-toast-notifications';
// API
import { organizationAPI } from '../../../redux/api/api';
// FUNCTIONS
import { CenteralUIColor } from "../../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../../Functions/Util";
// UTILITY
// import { sessUser } from '../../Utils/SessionStorageItems';
// COMPONENTS
import { TableLoad } from "../../Layout/Loader";
import NoData from "../../NoData/NoData";
import OrganizationsFilter from "./OrganizationsFilter";
import Pagination from '../../Pagination/Pagination';

const headCells = [
    { id: 'row', numeric: false, disablePadding: true, label: 'Row' },
    { id: 'organizationId', numeric: false, disablePadding: false, label: 'Organization ID' },
    { id: 'organizationTypeId', numeric: false, disablePadding: false, label: 'Type' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'isActive', numeric: false, disablePadding: false, label: 'Active' },
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead >
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
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
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
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
    // const customStyle = useCustomStyle();
    const classes = useToolbarStyles();
    const { numSelected, handleOpenFilter, onSearch, onDelete, isFilterApplied } = props;

    const searchRef = useRef(null)

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                    Organizations
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={onDelete}>
                        <DeleteIcon htmlColor='#f44336' />
                    </IconButton>
                </Tooltip>
            ) : (
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
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list" onClick={handleOpenFilter}>
                            <Badge color="error" variant="dot" invisible={!isFilterApplied}>
                                <FilterListIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    handleOpenFilter: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
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
        minHeight: 635,
        maxHeight: 635
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
}

var initialFilters = {
    organizationTypeId: null,
    inactive: null,
    applyFilter: false
}

var searchedKeyword = "";

function EnhancedTable(props) {
    const { rowSelected, setRowSelected, reload, setReload, userAllowedActions } = props;
    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('organizationId');
    const [selected, setSelected] = React.useState([]);
    const [openFilter, setOpenFilter] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [pagination, setPagination] = useState({ ...initialPagination });
    const [filters, setFilters] = useState({ ...initialFilters })

    useEffect(() => {
        let isMounted = true;

        const getOrganizations = async () => {
            if (!isMounted) return
            setLoading(true)
            try {
                const result = await organizationAPI().getAll(pagination, searchedKeyword, filters)
                if (result.status === 200) {
                    if (result.data.data) {
                        if (!isMounted) return;
                        setRows(result.data.data.organization);
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
                addToast("Error occurred in getting organizations!", {
                    appearance: "error"
                })
                if (!isMounted) return
                setLoading(false);
                setReload(false)
            }
        }

        if (reload) {
            getOrganizations();
        }

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [reload])

    const onSearch = async (event) => {
        if (event.key === 'Enter') {
            if (event.target.value.length > 0) {
                searchedKeyword = event.target.value;
                setFilters({ ...initialFilters });
                setPagination({ ...initialPagination });
                setReload(true);
            }
            else {
                searchedKeyword = "";
                setPagination({ ...initialPagination });
                setReload(true);
            }
        }
    };

    const onFilter = async (filters) => {
        searchedKeyword = "";
        document.querySelector("#txtSearch").value = "";
        setPagination({ ...initialPagination });
        setFilters(filters);
        setReload(true);
    };

    const onDelete = () => {
        if(!userAllowedActions[0].actions.includes("DEL")){
            addToast("You are not allowed to use this action.", {
                appearance: "error",
            });
            return;
        }

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this/these organization(s)!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                new Promise((resolve, reject) => {
                    selected.forEach(async (organizationId, index, array) => {
                        try {
                            const result = await organizationAPI().delete(organizationId)
                            if (result.status === 200) {
                                if (result.data.code === 0) {
                                    reject(result.data.message);
                                    return;
                                }
                            }
                        } catch (error) {
                            reject(`Error occurred in deleting ${organizationId}!`);
                            return;
                        }
                        if (index === array.length - 1) resolve();
                    })
                })
                    .then(() => {
                        addToast("Organization(s) successfully deleted!", {
                            appearance: "success",
                        });
                        setSelected([]);
                        setRowSelected([]);
                        setReload(true);
                    })
                    .catch((err) => {
                        addToast(String(err), {
                            appearance: "error",
                        });
                        setSelected([]);
                        setRowSelected([]);
                        setReload(true);
                    })
            }
        });
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.organizationId);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleRowClick = (event, id) => {
        const selectedIndex = rowSelected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(id);
        } else {
            newSelected = [];
        }

        setRowSelected(newSelected);
    };

    const handleOpenFilter = () => {
        setOpenFilter(true);
    };

    const handleCloseFilter = () => {
        setOpenFilter(false);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const isRowSelected = (id) => rowSelected.indexOf(id) !== -1;

    return (
        <div className={classes.root}>
            <OrganizationsFilter
                open={openFilter}
                handleClose={handleCloseFilter}
                setFilters={setFilters}
                onFilter={onFilter}
                setReload={setReload}
            />
            <Paper className={classes.paper}>
                <EnhancedTableToolbar 
                    numSelected={selected.length} 
                    handleOpenFilter={handleOpenFilter} 
                    onSearch={onSearch} 
                    onDelete={onDelete} 
                    isFilterApplied={filters.applyFilter}
                />
                <TableContainer className={classes.tableContainer}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        aria-label="organizations table"
                        stickyHeader
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />

                        <TableBody>
                            {loading
                                ? <TableLoad count={20} cols={headCells.length + 1} />
                                : rows.length === 0
                                    ? <NoData cols={headCells.length + 1} />
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.organizationId);
                                            const isRowItemSelected = isRowSelected(row.organizationId);
                                            const labelId = `organization-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected || isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.organizationId}
                                                    onClick={(event) => handleRowClick(event, row.organizationId)}
                                                    selected={isItemSelected || isRowItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            onClick={(event) => handleClick(event, row.organizationId)}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" id={labelId} scope="row" padding="none">
                                                        {pagination.rowFrom + index}
                                                    </TableCell>
                                                    <TableCell align="left">{row.organizationId}</TableCell>
                                                    <TableCell align="left">{row.organizationTypeID}</TableCell>
                                                    <TableCell align="left">{row.organizationName}</TableCell>
                                                    <TableCell align="left">
                                                        {row.inactive === 0
                                                            ? <CheckCircleIcon htmlColor="green" />
                                                            : <CancelIcon htmlColor="red" />
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                            {/* {(emptyRows > 0) && (
                                        <TableRow style={{ height: 50 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )} */}
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
    rowSelected: PropTypes.array.isRequired,
    setRowSelected: PropTypes.func.isRequired,
    reload: PropTypes.bool.isRequired,
    setReload: PropTypes.func.isRequired,
    userAllowedActions: PropTypes.array
};

export const OrganizationTable = React.memo(EnhancedTable);
