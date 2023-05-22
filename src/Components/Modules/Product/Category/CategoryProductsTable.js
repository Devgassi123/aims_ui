import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import {
    Box,
    IconButton,
    InputAdornment,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography
} from '@material-ui/core';
import {
    FilterList as FilterListIcon, FirstPage as FirstPageIcon,
    KeyboardArrowLeft, KeyboardArrowRight,
    LastPage as LastPageIcon,
    Search as SearchIcon
} from '@material-ui/icons';

import { productAPI } from '../../../../redux/api/api';
import { CenteralUIColor } from "../../../../Functions/CustomStyle"
import { getComparator, stableSort } from '../../../../Functions/Util';
//COMPONENTS
import { TableLoad } from '../../../Layout/Loader';
import CategoryFilter from "./CategoryFilter";
import NoData from '../../../NoData/NoData';
import { useToasts } from 'react-toast-notifications';

const headCells = [
    { id: 'sku', numeric: false, disablePadding: false, label: 'SKU' },
    { id: 'productName', numeric: false, disablePadding: false, label: 'Product Name' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
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
    const { handleOpenFilter } = props;

    return (
        <Toolbar
            className={classes.root}
        >
            <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                Products
            </Typography>

            <Box display="flex">
                <Box mr={1}>
                    <Tooltip title="Search Group ID, Group Name...">
                        <TextField
                            id="txtSearch"
                            label="Search"
                            variant="outlined"
                            size="small"
                            margin="dense"
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                            }}
                            style={{ backgroundColor: "white" }}
                        />
                    </Tooltip>
                </Box>
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list" onClick={handleOpenFilter}>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    handleOpenFilter: PropTypes.func.isRequired,
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
        minHeight: 589,
        maxHeight: 589
    },
    pagination: {
        borderTop: "0.1px solid #ccc",
    }
}));

function EnhancedTable({categoryId, selectedItems, onSelect, onDrag, selectedStyle}) {
    const classes = useStyles();
    const { addToast } = useToasts();
    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('sku');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [openFilter, setOpenFilter] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [reload, setReload] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const getProductList = async () => {
            isMounted && setLoading(true)
            try {
                const result = await productAPI().getAll()
                if (result.status === 200) {
                    if (result.data.data) {
                        const data = result.data.data.filter((item) => item.productCategoryId === categoryId)
                        isMounted && setRows(data);
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

        if(categoryId && categoryId.length > 0) {
            getProductList();
        }
        else {
            setRows([]);
            setReload(false);
            setLoading(false);
        }

        return () => isMounted = false;
    // eslint-disable-next-line
    }, [categoryId, reload])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenFilter = () => {
        setOpenFilter(true);
    };

    const handleCloseFilter = () => {
        setOpenFilter(false);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <CategoryFilter open={openFilter} handleClose={handleCloseFilter} />
            <Paper className={classes.paper}>
                <EnhancedTableToolbar handleOpenFilter={handleOpenFilter} />
                <TableContainer className={classes.tableContainer}>
                    <Table
                        className={classes.table}
                        size="small"
                        aria-labelledby="tableTitle"
                        aria-label="category products table"
                        stickyHeader
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />

                        <TableBody>
                            {loading
                                ? <TableLoad count={rowsPerPage} cols={headCells.length} />
                                : rows.length === 0
                                    // ? <TableLoad count={rowsPerPage} cols={headCells.length + 1} />
                                    ? <NoData />
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const labelId = `product-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    key={row.sku}
                                                    title="Tip: You can change item's category by dragging and dropping."
                                                    draggable
                                                    onClick={(event) => onSelect(rows, index, event.metaKey, event.shiftKey)}
                                                    onDragStart={(e) => {
                                                        onDrag(e, {
                                                            products: selectedItems.selectedFields,
                                                        });
                                                    }}
                                                    onDragEnd={(e) => setReload(true)}
                                                    className={selectedStyle(row.sku)}
                                                >
                                                    <TableCell component="th" id={labelId} scope="row">
                                                        {row.sku}
                                                    </TableCell>
                                                    <TableCell align="left">{row.productName}</TableCell>
                                                    <TableCell align="left">{row.description}</TableCell>
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
    categoryId: PropTypes.any.isRequired,
    selectedItems: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onDrag: PropTypes.func.isRequired,
    selectedStyle: PropTypes.func.isRequired,
};

export const CategoryProductsTable = React.memo(EnhancedTable);
