import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import {
    Box,
    IconButton,
    InputAdornment,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Toolbar, Tooltip
} from '@material-ui/core';
import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft, KeyboardArrowRight,
    LastPage as LastPageIcon,
    Search as SearchIcon
} from '@material-ui/icons';

import { CenteralUIColor } from "../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../Functions/Util";
import { TableLoad } from "../Layout/Loader";
import NoData from "../NoData/NoData";
import { productAPI } from '../../redux/api/api';
import Pagination from '../Pagination/Pagination';
import { useToasts } from 'react-toast-notifications';

const headCells = [
    { id: 'row', numeric: false, disablePadding: false, label: 'Row' },
    { id: 'sku', numeric: false, disablePadding: true, label: 'SKU' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'uomRef', numeric: false, disablePadding: false, label: 'UOM' },
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
};

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
        backgroundColor: CenteralUIColor.LightestBrown,
        justifyContent: "flex-end"
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
    const { onSearch } = props;
    // const customStyle = useCustomStyle();
    const classes = useToolbarStyles();

    return (
        <Toolbar
            className={clsx(classes.root)}
        >
            {/* <Box display="flex" justifyContent="flex-end"> */}
            <Box mr={1}>
                <Tooltip title="Search Product ID, Product Name...">
                    <TextField
                        id="txtItemSelectorSearch"
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
            {/* </Box> */}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    onSearch: PropTypes.func.isRequired
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

    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
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
    onChangePage: PropTypes.func.isRequired,
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
        cursor: "pointer"
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
        minHeight: 450,
        maxHeight: 450
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
};

var searchedKeyword = "";

function EnhancedTable(props) {
    const {productId, rowSelected, setRowSelected, onDoubleClick } = props;

    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('sku');
    const [loading, setLoading] = React.useState(true);
    const [pagination, setPagination] = useState({ ...initialPagination })
    const [reload, setReload] = useState(true);
    const filters = {
        uomRef: null,
        productCategoryId: null,
        productCategoryId2: null,
        productCategoryId3: null,
        applyFilter: false
    }

    useEffect(() => {
        let isMounted = true;

        const getProductList = async () => {
            isMounted && setLoading(true)

            searchedKeyword = productId;

            try {
                const result = await productAPI().aggregated(pagination, searchedKeyword, filters)
                if (result.status === 200) {
                    if (result.data.data) {
                        if (!isMounted) return
                        setRows(result.data.data.product);
                        setPagination(result.data.data.pagination)
                    }
                    else {
                        if (!isMounted) return
                        setRows([]);
                        setPagination({ ...initialPagination })
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
        }


        if (reload) {
            getProductList();
        }

        if (productId !== "") {
            document.querySelector("#txtItemSelectorSearch").value = productId;
            document.querySelector("#txtItemSelectorSearch").disabled = true;
        }

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [reload])

    const onSearch = async (event) => {
        if (event.key === 'Enter') {
            if (event.target.value.length > 0) {
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

    const handleRowClick = (event, id) => {
        switch (event.detail) {
            case 1:
                const selectedIndex = rowSelected.indexOf(id);
                let newSelected = [];

                if (selectedIndex === -1) {
                    newSelected = newSelected.concat(id);
                } else {
                    newSelected = [];
                }

                setRowSelected(newSelected);
                break;
            case 2:
                onDoubleClick(id)
                break;
            default:
                break;
        }
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
                        aria-label="product list table"
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
                                ? <TableLoad count={pagination.pageSize} cols={headCells.length + 1} />
                                : rows.length === 0
                                    ? <NoData />
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .map((row, index) => {
                                            const isRowItemSelected = isRowSelected(row.sku);
                                            const labelId = `products-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.sku}
                                                    onClick={(event) => handleRowClick(event, row.sku)}
                                                    selected={isRowItemSelected}
                                                    title="Double click row to select the item"
                                                >
                                                    <TableCell component="th" id={labelId} scope="row" padding='checkbox'>
                                                        {pagination.rowFrom + index}
                                                    </TableCell>
                                                    <TableCell align="left" padding="none">{row.sku}</TableCell>
                                                    <TableCell align="left">{row.description}</TableCell>
                                                    <TableCell align="left">{row.uomRef}</TableCell>
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
    onDoubleClick: PropTypes.func.isRequired
};

export const ItemTable = React.memo(EnhancedTable);
