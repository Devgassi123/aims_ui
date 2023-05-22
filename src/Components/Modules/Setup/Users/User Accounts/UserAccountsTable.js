import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
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
    Delete as DeleteIcon,
    FilterList as FilterListIcon, FirstPage as FirstPageIcon,
    KeyboardArrowLeft, KeyboardArrowRight,
    LastPage as LastPageIcon,
    Search as SearchIcon
} from '@material-ui/icons';
import { useToasts } from 'react-toast-notifications';
import swal from 'sweetalert';
//API
import { userAccAPI } from '../../../../../redux/api/api';
// FUNCTIONS & UTILS
import { CenteralUIColor } from "../../../../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../../../../Functions/Util";
//COMPONENTS
import { TableLoad } from "../../../../Layout/Loader";
import NoData from "../../../../NoData/NoData";
import { UserAccountsFilters } from "./UserAccountsFilter"
import Pagination from '../../../../Pagination/Pagination';

const headCells = [
    { id: 'userAccountId', numeric: false, disablePadding: true, label: 'Account ID' },
    { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name' },
    { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
    { id: 'inactive', numeric: false, disablePadding: false, label: 'Active' }
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
    const { numSelected, handleOpenFilter, onSearch, onDelete, isFilterOn } = props;

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
                    User Accounts
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={onDelete} color='secondary'>
                        <DeleteIcon htmlColor='red'/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Box display="flex">
                    <Box mr={1}>
                        <Tooltip title="Search Account ID, First Name, Last Name, Email...">
                            <TextField
                                id="txtSearch"
                                label="Search"
                                variant="outlined"
                                size="small"
                                margin="dense"
                                onKeyDown={onSearch}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                                }}
                                style={{ backgroundColor: "white" }}
                            />
                        </Tooltip>
                    </Box>
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list" onClick={handleOpenFilter}>
                            <Badge color="error" badgeContent=" " variant='dot' invisible={!isFilterOn}>
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
    onSearch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isFilterOn: PropTypes.bool.isRequired,
};

const usePaginationStyles = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
        justifyContent: "flex-end"
    },
}));

function TablePaginationActions(props) {
    const classes = usePaginationStyles();
    const theme = useTheme();

    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
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
    },
    badge: {
        marginLeft: theme.spacing(2)
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

var searchedKeyword = "";

function EnhancedTable(props) {
    const { rowSelected, setRowSelected, reload, setReload } = props;

    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('userAccountId');
    const [selected, setSelected] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ ...initialPagination })
    const [filters, setFilters] = useState({
        accessRightId: null,
        inactive: null,
        accountExpiry: null,
        applyFilter: false
    })

    useEffect(() => {
        let isMounted = true;

        if (reload) {
            (async () => {
                if (!isMounted) return
                setLoading(true)
                setRowSelected([]);
                setSelected([]);

                try {
                    const result = await userAccAPI().aggregated(pagination, searchedKeyword, filters)
                    if (result.status === 200) {
                        if (result.data.data) {
                            if (!isMounted) return;
                            setRows(result.data.data.userAccount);
                            setPagination(result.data.data.pagination);
                        }
                        else {
                            if (!isMounted) return;
                            setRows([]);
                            setPagination({ ...initialPagination })
                        }
                        if (!isMounted) return
                        setLoading(false);
                        setReload(false);
                    }
                } catch (error) {
                    addToast("Error occurred in getting accounts!", {
                        appearance: "error"
                    })
                    if (!isMounted) return
                    setLoading(false);
                    setReload(false);
                }
            })()
        }

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [reload])

    const onSearch = (event) => {
        if (event.key === 'Enter') {
            if (event.target.value.length > 0) {
                setFilters({
                    accessRightId: null,
                    inactive: null,
                    accountExpiry: null,
                    applyFilter: false
                });
                searchedKeyword = event.target.value;
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

    const onFilter = (filters) => {
        searchedKeyword = "";
        document.querySelector("#txtSearch").value = "";
        setPagination({ ...initialPagination });
        setFilters(filters);
        setReload(true);
    };

    const onDelete = () => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this/these organization(s)!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                new Promise((resolve, reject) => {
                    selected.forEach(async (userAccoutId, index, array) => {
                        try {
                            const result = await userAccAPI().delete(userAccoutId)
                            if (result.status === 200) {
                                if (result.data.code === 0) {
                                    reject(`System could not delete ${userAccoutId}.\n\n` + result.data.message);
                                    return;
                                }
                            }
                        } catch (error) {
                            reject(`Error occurred in deleting ${userAccoutId}!\n` + error);
                            return;
                        }
                        if (index === array.length - 1) resolve();
                    })
                })
                    .then(() => {
                        addToast("User account(s) successfully deleted!", {
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
            const newSelecteds = rows.map((n) => n.userAccountId);
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
            <UserAccountsFilters
                open={openFilter}
                handleClose={handleCloseFilter}
                filters={filters}
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
                    isFilterOn={filters.applyFilter}
                />
                <TableContainer className={classes.tableContainer}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        aria-label="user accounts table"
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
                                ? <TableLoad count={10} cols={headCells.length + 1} />
                                : rows.length === 0
                                    // ? <TableLoad count={rowsPerPage} cols={headCells.length + 1} />
                                    ? <NoData cols={headCells.length + 1} />
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.userAccountId);
                                            const isRowItemSelected = isRowSelected(row.userAccountId);
                                            const labelId = `account-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected || isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.userAccountId}
                                                    onClick={(event) => handleRowClick(event, row.userAccountId)}
                                                    selected={isItemSelected || isRowItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            onClick={(event) => handleClick(event, row.userAccountId)}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" id={labelId} scope="row" padding="none">
                                                        {row.userAccountId}
                                                    </TableCell>
                                                    <TableCell align='left'>{row.firstName}</TableCell>
                                                    <TableCell align="left">{row.lastName}</TableCell>
                                                    <TableCell align="left">
                                                        {row.inactive === 0
                                                            ? <Badge badgeContent="Yes" color="primary" className={classes.badge} />
                                                            : <Badge badgeContent="No " color="error" className={classes.badge} />
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                            }
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
};

export const UserAccountsTable = React.memo(EnhancedTable);
