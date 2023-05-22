import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Box,
    InputAdornment,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography
} from '@material-ui/core';
import {
    Search as SearchIcon
} from '@material-ui/icons';

import { idNumberAPI } from '../../../../../redux/api/api';
import { useToasts } from 'react-toast-notifications';

import { CenteralUIColor } from "../../../../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../../../../Functions/Util";
import { TableLoad } from "../../../../Layout/Loader";
import NoData from "../../../../NoData/NoData";
import Pagination from "../../../../Pagination/Pagination"

const headCells = [
    { id: 'row', numeric: true, disablePadding: true, label: 'Row' },
    { id: 'transactionTypeId', numeric: false, disablePadding: true, label: 'Transaction Type' },
    { id: 'prefix', numeric: false, disablePadding: false, label: 'Prefix' },
    { id: 'suffix', numeric: false, disablePadding: false, label: 'Suffix' },
    { id: 'startId', numeric: false, disablePadding: false, label: 'Start ID' },
    { id: 'lastId', numeric: false, disablePadding: false, label: 'Last ID' },
    { id: 'zeroesLength', numeric: false, disablePadding: false, label: 'Format' },
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
                        padding={headCell.id === "row" ? 'checkbox' : headCell.disablePadding ? 'none' : 'normal'}
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
    const { numSelected, onSearch } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                Documents
            </Typography>

            <Box display="flex">
                <Box mr={1}>
                    <Tooltip title="Search Trasaction Type, Suffix, Prefix...">
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
            </Box>
        </Toolbar>
    );
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
    rowFrom: 1,
    rowTo: 0,
    pageSize: 100,
}

function EnhancedTable(props) {
    const { rowSelected, setRowSelected, reload, setReload } = props;
    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('transactionTypeId');
    const [loading, setLoading] = React.useState(true);
    const [pagination, setPagination] = useState({...initialPagination});

    useEffect(() => {
        let isMounted = true;

        if (reload) {
            (async () => {
                isMounted && setLoading(true)

                try {
                    const result = await idNumberAPI().getAll(pagination)
                    if (result.status === 200) {
                        if (result.data.data) {
                            if (!isMounted) return
                            setRows(result.data.data);
                            setPagination((prev) => ({
                                ...prev, 
                                count: result.data.data.length,
                                rowTo: result.data.data.length
                            }))
                        }
                        if (!isMounted) return
                        setLoading(false);
                        setReload(false);
                    }
                } catch (error) {
                    addToast("Error occurred in getting organizations!", {
                        appearance: "error"
                    })
                    if (!isMounted) return
                    setLoading(false);
                    setReload(false);
                }
            })();
        }

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [reload])

    const onSearch = async (event) => {
        if (event.key === 'Enter') {
            setLoading(true);
            setRowSelected([]);
            setPagination({ ...initialPagination });;

            if (event.target.value.length > 0) {
                try {
                    const result = await idNumberAPI().search(event.target.value, pagination)
                    if (result.status === 200) {
                        if (result.data.data) {
                            setRows(result.data.data)
                            setPagination((prev) => ({
                                ...prev, 
                                count: result.data.data.length,
                                rowTo: result.data.data.length
                            }))
                        }
                        else {
                            setRows([]);
                        }
                        setLoading(false);
                    }
                } catch (error) {
                    addToast("Error occurred in searching! " + String(error), {
                        appearance: "error"
                    })
                }
            }
            else {
                setReload(true);
            }
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
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

    const isRowSelected = (id) => rowSelected.indexOf(id) !== -1;

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar onSearch={onSearch} />
                <TableContainer className={classes.tableContainer}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        aria-label="document numbering table"
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
                                ? <TableLoad count={20} cols={headCells.length} />
                                : rows.length === 0
                                    ? <NoData cols={headCells.length} />
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .map((row, index) => {
                                            const isRowItemSelected = isRowSelected(row.transactionTypeId);
                                            const labelId = `docno-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.transactionTypeId}
                                                    onClick={(event) => handleRowClick(event, row.transactionTypeId)}
                                                    selected={isRowItemSelected}
                                                >
                                                    <TableCell component="th" id={labelId} scope="row" align="right" padding='checkbox'>
                                                        {pagination.rowFrom + index}
                                                    </TableCell>
                                                    <TableCell align="left" padding='none'>{row.transactionTypeId}</TableCell>
                                                    <TableCell align="left">{row.prefix}</TableCell>
                                                    <TableCell align="left">{row.suffix}</TableCell>
                                                    <TableCell align="left">{row.startId}</TableCell>
                                                    <TableCell align="left">{row.lastId}</TableCell>
                                                    <TableCell align="left">{row.zeroesLength}</TableCell>
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

export const DocNoTable = React.memo(EnhancedTable);
