import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import {
    Box,
    IconButton,
    InputAdornment,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Toolbar, Typography
} from '@material-ui/core';
import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft, KeyboardArrowRight,
    LastPage as LastPageIcon,
    Search as SearchIcon
} from '@material-ui/icons';

import { useToasts } from 'react-toast-notifications';
// API
import { auditTrailAPI } from '../../../../redux/api/api';
// FUNCTIONS
import { CenteralUIColor } from "../../../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../../../Functions/Util";
// COMPONENTS
import { TableLoad } from "../../../Layout/Loader";
import NoData from "../../../NoData/NoData";
import Pagination from '../../../Pagination/Pagination';

const headCells = [
    { id: 'auditDate', numeric: false, disablePadding: false, label: 'Date' },
    { id: 'userAccountId', numeric: false, disablePadding: false, label: 'User' },
    { id: 'transactionTypeId', numeric: false, disablePadding: false, label: 'Module' },
    { id: 'actionTypeId', numeric: false, disablePadding: false, label: 'Action' },
    { id: 'recordId', numeric: false, disablePadding: false, label: 'Record ID' }
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
    // const customStyle = useCustomStyle();
    const classes = useToolbarStyles();
    const { onSearch } = props;

    return (
        <Toolbar
            className={clsx(classes.root)}
        >
            <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                Logs
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
                        title="Search Date, User, Transaction Type, Record ID..."
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
    const { rowSelected, setRowSelected, reload, setReload, filters, setFilters } = props;
    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('auditDate');
    const [loading, setLoading] = React.useState(true);
    const [pagination, setPagination] = React.useState({ ...initialPagination })

    useEffect(() => {
        let isMounted = true;

        const getLogs = async () => {
            isMounted && setLoading(true)

            if (filters.applyFilter) {
                searchedKeyword = "";
                document.querySelector("#txtSearch").value = "";
                setPagination({ ...initialPagination });
            }

            try {
                const result = await auditTrailAPI().aggregated(pagination, searchedKeyword, filters)
                if (result.status === 200) {
                    if (result.data.data) {
                        if (!isMounted) return
                        setRows(result.data.data.auditTrail);
                        setPagination(result.data.data.pagination)
                    }
                    else {
                        if (!isMounted) return;
                        setRows([]);
                        setPagination({ ...initialPagination })

                    }
                    if (!isMounted) return
                    setLoading(false);
                    setReload(false);
                    setFilters(prev => ({ ...prev, applyFilter: false }));
                }
            } catch (error) {
                addToast("Error occurred in getting logs!\n\n" + error, {
                    appearance: "error"
                })
                if (!isMounted) return
                setLoading(false);
                setReload(false);
                setFilters(prev => ({ ...prev, applyFilter: false }));
            }
        }

        if (reload) {
            getLogs();
        }

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [reload])

    // useEffect(() => {
    //     let isMounted = true;

    //     const getFilteredLogs = async () => {
    //         isMounted && setLoading(true)
    //         try {
    //             const result = await auditTrailAPI().filter(filters)
    //             if (result.status === 200) {
    //                 if (result.data.code === 0) {
    //                     isMounted && setRows([]);
    //                 }
    //                 else {
    //                     isMounted && setRows(result.data.data);
    //                 }

    //                 if (!isMounted) return
    //                 setLoading(false);
    //                 setFilters(prev => ({...prev, applyFilter: false}));
    //             }
    //         } catch (error) {
    //             addToast("Error occurred in getting filtered logs!\n\n" + error, {
    //                 appearance: "error"
    //             })
    //             if (!isMounted) return
    //             setLoading(false);
    //             setFilters(prev => ({...prev, applyFilter: false}));
    //         }
    //     }

    //     if (filters.applyFilter) {
    //         getFilteredLogs();
    //     }

    //     return () => isMounted = false;
    // // eslint-disable-next-line
    // }, [filters])

    const onSearch = async (event) => {
        if (event.key === 'Enter') {
            if (event.target.value.length > 0) {
                setFilters({
                    recordId: null,
                    auditDateFrom: null,
                    auditDateTo: null,
                    userAccountId: null,
                    transactionTypeId: null,
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

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleRowClick = (event, item) => {
        const selectedIndex = rowSelected.findIndex((row) => row.auditId === item.auditId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(item);
        } else {
            newSelected = [];
        }

        setRowSelected(newSelected);
    };

    // const isRowSelected = (id) => rowSelected.indexOf(id) !== -1;
    const isRowSelected = (id) => rowSelected.findIndex((row) => row.auditId === id) !== -1;

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar onSearch={onSearch} />
                <TableContainer className={classes.tableContainer}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        aria-label="logs table"
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
                                ? <TableLoad count={10} cols={headCells.length + 1} />
                                : rows.length === 0
                                    ? <NoData cols={headCells.length + 1} />
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .map((row, index) => {
                                            const isRowItemSelected = isRowSelected(row.auditId);
                                            const labelId = `log-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.auditId}
                                                    onClick={(event) => handleRowClick(event, row)}
                                                    selected={isRowItemSelected}
                                                >
                                                    <TableCell component="th" id={labelId} scope="row">
                                                        {row.auditDate.replace("T", " ")}
                                                    </TableCell>
                                                    <TableCell align="left">{row.userAccountId}</TableCell>
                                                    <TableCell align="left">{row.transactionTypeId}</TableCell>
                                                    <TableCell align="left">{row.actionTypeId}</TableCell>
                                                    <TableCell align="left">{row.recordId}</TableCell>
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
    setReload: PropTypes.func.isRequired
};

export const AuditTrailTable = React.memo(EnhancedTable);
