import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import {
    IconButton,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Typography
} from '@material-ui/core';
import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft, KeyboardArrowRight,
    LastPage as LastPageIcon,
} from '@material-ui/icons';
import { useToasts } from 'react-toast-notifications';

import { configAPI } from '../../../../../redux/api/api';

import { CenteralUIColor } from "../../../../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../../../../Functions/Util";
import { TableLoad } from "../../../../Layout/Loader";
import NoData from "../../../../NoData/NoData";

const headCells = [
    { id: 'configName', numeric: false, disablePadding: false, label: 'UOM' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'intValue', numeric: false, disablePadding: false, label: 'Sequence'}
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
    const classes = useToolbarStyles();
    const { numSelected, } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                UOM
            </Typography>
        </Toolbar>
    );
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

function EnhancedTable(props) {
    const { rowSelected, setRowSelected, reload, setReload } = props;
    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('configName');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        let isMounted = true;

        if (reload) {
            (async () => {
                isMounted && setLoading(true)
                try {
                    const result = await configAPI().getUOM()
                    if (result.status === 200) {
                        if (result.data.data) {
                            isMounted && setRows(result.data.data);
                        }
                        else {
                            isMounted && setRows([]);
                        }
                        if (!isMounted) return
                        setLoading(false);
                        setReload(false);
                    }
                } catch (error) {
                    addToast("Error occurred in getting UOMs!\n" + error, {
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

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleRowClick = (event, row) => {
        const selectedIndex = rowSelected.findIndex((row) =>  row.configName === row.id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(row);
        } else {
            newSelected = [];
        }

        setRowSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isRowSelected = (id) => rowSelected.findIndex((row) =>  row.configName === id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar />
                <TableContainer className={classes.tableContainer}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        aria-label="UOM table"
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
                                ? <TableLoad count={rowsPerPage} cols={headCells.length} />
                                : rows.length === 0
                                    ? <NoData cols={headCells.length} />
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isRowItemSelected = isRowSelected(row.configName);
                                            const labelId = `docno-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.configName}
                                                    onClick={(event) => handleRowClick(event, row)}
                                                    selected={isRowItemSelected}
                                                >
                                                    <TableCell component="th" id={labelId} scope="row">
                                                        {row.configName}
                                                    </TableCell>
                                                    <TableCell align="left">{row.description}</TableCell>
                                                    <TableCell align="left">{row.intValue}</TableCell>
                                                </TableRow>
                                            );
                                        })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 50, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    className={clsx({ [classes.pagination]: emptyRows > 0 })}
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

export const UOMRefTable = React.memo(EnhancedTable);
