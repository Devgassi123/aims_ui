import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Badge,
    Box,
    Checkbox,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography
} from '@material-ui/core';
import {
    Add as AddIcon,
    FilterList as FilterListIcon,
    Search as SearchIcon,
    Cancel as CancelIcon
} from '@material-ui/icons';
import { SiMicrosoftexcel } from 'react-icons/si'
import swal from 'sweetalert';
import { useToasts } from 'react-toast-notifications';
// API
import { purchaseOrderAPI, receiveReturnAPI } from '../../../../redux/api/api';
// FUNCTIONS
import { CenteralUIColor } from "../../../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../../../Functions/Util";
// UTILITY
// import { sessUser } from '../../Utils/SessionStorageItems';
// COMPONENTS
import { TableLoad } from "../../../Layout/Loader";
import NoData from ".././../../NoData/NoData";
import ReceiveReturnsFilters from './ReceiveReturnsFilters';
import Pagination from '../../../Pagination/Pagination';
import ImportExport from '../ImportExport/ImportExport';

const headCells = [
    { id: 'row', numeric: false, disablePadding: true, label: 'Row' },
    { id: 'returnDate', numeric: false, disablePadding: false, label: 'Return Date' },
    { id: 'returnsId', numeric: false, disablePadding: false, label: 'Return #' },
    { id: 'refNumber', numeric: false, disablePadding: false, label: 'Reference #' },
    { id: 'storeFrom', numeric: false, disablePadding: false, label: 'Store From' },
    { id: 'returnStatusId', numeric: false, disablePadding: false, label: 'Return Status' },
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
};

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
    const { numSelected, handleOpenFilter, handleOpenImportExport, onSearch, onCancelPO, onAddPO, isFilterOn } = props;

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
                    Returns
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Cancel PO">
                    <IconButton aria-label="cancel" onClick={onCancelPO}>
                        <CancelIcon htmlColor='red' />
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
                            <Badge color="error" badgeContent=" " variant='dot' invisible={!isFilterOn}>
                                <FilterListIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem />
                    <Tooltip title="Import/Export">
                        <IconButton aria-label="add P.O." onClick={handleOpenImportExport}>
                            <SiMicrosoftexcel />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="New Returns">
                        <IconButton aria-label="add Returns" onClick={onAddPO}>
                            <AddIcon />
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
    onCancelPO: PropTypes.func.isRequired,
    onAddPO: PropTypes.func.isRequired,
    isFilterOn: PropTypes.bool.isRequired
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
        minHeight: 650,
        maxHeight: 650
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
    const { rowSelected, setRowSelected, reload, setReload, setFullWidthTbl, softReload, setSoftReload } = props;

    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('returnsId');
    const [selected, setSelected] = React.useState([]);
    const [openFilter, setOpenFilter] = React.useState(false);
    const [openImportExport, setOpenImportExport] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [pagination, setPagination] = useState({ ...initialPagination })
    const [filters, setFilters] = useState({
        storeId: null,
        returnsStatusId: null,
        carrierId: null,
        returnDate: null,
        applyFilter: false
    })

    useEffect(() => {
        let isMounted = true;

        if (reload) {
            (async () => {
                if (!isMounted) return
                setLoading(true);

                if (softReload === false) {
                    setRowSelected([]);
                    setSelected([]);
                }

                try {
                    const result = await receiveReturnAPI().aggregated(pagination, searchedKeyword, filters)
                    if (result.status === 200) {
                        if (result.data.data) {
                            if (!isMounted) return;
                            setRows(result.data.data.returns);
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
                        setSoftReload(false)
                    }
                } catch (error) {
                    addToast("Error occurred in getting purchase orders!", {
                        appearance: "error"
                    })
                    if (!isMounted) return
                    setLoading(false);
                    setReload(false)
                    setSoftReload(false)
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
                    storeId: null,
                    returnsStatusId: null,
                    carrierId: null,
                    returnDate: null,
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

    const onAddPO = () => {
        setFullWidthTbl(false);
        setRowSelected([]);
        setSelected([]);
    };

    const onCancelPO = () => {
        swal({
            title: "Are you sure?",
            text: "Once cancelled, you will not be able to recover this order!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willCancel) => {
            if (willCancel) {
                try {
                    const result = await purchaseOrderAPI().cancel(selected[0])
                    if (result.status === 200) {
                        if (result.data.code === 0) {
                            // PO or Detail Status is not "CREATED"
                            if (result.data.data === "PODETAILSSTATUSALTERED" || result.data.data === "POSTATUSALTERED") {
                                onForceCancelPO();
                            }
                            else {
                                addToast(result.data.message, {
                                    appearance: "error",
                                });
                            }
                        }
                        else {
                            addToast("Order successfully cancelled!", {
                                appearance: "success",
                            });
                            setSelected([]);
                            setRowSelected([]);
                            setReload(true);
                        }
                    }
                } catch (error) {
                    addToast(String(error), {
                        appearance: "error",
                    });
                    setSelected([]);
                    setRowSelected([]);
                    setReload(true);
                }
            }
        });
    };

    const onForceCancelPO = () => {
        swal({
            title: "Try Force Close PO instead?",
            text: "Order Status is already modified.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (isForcedCancel) => {
            if (isForcedCancel) {
                try {
                    const forcedCancelResult = await purchaseOrderAPI().forceCancel(selected[0])
                    if (forcedCancelResult.status === 200) {
                        if (forcedCancelResult.data.code === 0) {
                            addToast(forcedCancelResult.data.message, {
                                appearance: "error",
                            });
                        }
                        else {
                            addToast("Order successfully force cancelled!", {
                                appearance: "success",
                            });
                            setSelected([]);
                            setRowSelected([]);
                            setReload(true);
                        }
                    }
                } catch (error) {
                    addToast(String(error), {
                        appearance: "error",
                    });
                    setSelected([]);
                    setRowSelected([]);
                    setReload(true);
                }
            }
        })
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
        setRowSelected([id]);
        setFullWidthTbl(false);
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
            <ReceiveReturnsFilters
                open={openFilter}
                handleClose={handleCloseFilter}
                filters={filters}
                setFilters={setFilters}
                onFilter={onFilter}
                setReload={setReload}
            />
            <ImportExport
                open={openImportExport}
                handleClose={() => setOpenImportExport(false)}
            />
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    handleOpenFilter={handleOpenFilter}
                    handleOpenImportExport={() => setOpenImportExport(true)}
                    onSearch={onSearch}
                    onCancelPO={onCancelPO}
                    onAddPO={onAddPO}
                    isFilterOn={filters.applyFilter}
                />
                <TableContainer className={classes.tableContainer}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        aria-label="purchase order table"
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
                                            const isItemSelected = isSelected(row.returnsId);
                                            const isRowItemSelected = isRowSelected(row.returnsId);
                                            const labelId = `returns-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected || isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.returnsId}
                                                    selected={isItemSelected || isRowItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            onClick={(event) => handleClick(event, row.returnsId)}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" id={labelId} scope="row" padding="none" onClick={(event) => handleRowClick(event, row.returnsId)}>
                                                        {pagination.rowFrom + index}
                                                    </TableCell>
                                                    <TableCell align="left" onClick={(event) => handleRowClick(event, row.returnsId)}>{moment(row.returnDate).format("MM-DD-YYYY HH:mm")}</TableCell>
                                                    <TableCell align="left" onClick={(event) => handleRowClick(event, row.returnsId)}>{row.returnsId}</TableCell>
                                                    <TableCell align="left" onClick={(event) => handleRowClick(event, row.returnsId)}>{row.refNumber}</TableCell>
                                                    <TableCell align="left" onClick={(event) => handleRowClick(event, row.returnsId)}>{row.storeFrom}</TableCell>
                                                    <TableCell align="left" onClick={(event) => handleRowClick(event, row.returnsId)}
                                                        style={{
                                                            color: clsx({
                                                                "#2196f3": row.returnStatus.includes("Created"),
                                                                "green": row.returnStatus.includes("Fully"),
                                                                "orange": row.returnStatus.includes("Partial"),
                                                                "red": row.returnStatus.includes("Cancel"),
                                                            })
                                                        }}
                                                    >
                                                        {row.returnStatus}
                                                    </TableCell>
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
    rowSelected: PropTypes.array.isRequired,
    setRowSelected: PropTypes.func.isRequired,
    reload: PropTypes.bool.isRequired,
    setReload: PropTypes.func.isRequired,
    setFullWidthTbl: PropTypes.func.isRequired
};

export const ReceiveReturnsTable = React.memo(EnhancedTable);
