import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Checkbox,
    Chip,
    IconButton,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Toolbar, Tooltip, Typography
} from '@material-ui/core';
import {
    Delete as DeleteIcon,
} from '@material-ui/icons';
import {
    FaHandHoldingMedical
} from 'react-icons/fa'
import { useToasts } from 'react-toast-notifications';
import swal from 'sweetalert';
// API
import { receiveReturnDetailsAPI } from '../../../../../../../redux/api/api';
// FUNCTIONS
import { CenteralUIColor } from "../../../../../../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../../../../../../Functions/Util";
// COMPONENTS
import { TableLoad } from "../../../../../../Layout/Loader";
import Pagination from '../../../../../../Pagination/Pagination';
import Receiving from '../../../../Receiving/Receiving';

const headCells = [
    { id: 'returnsLineId', numeric: false, disablePadding: true, label: 'Line #' },
    { id: 'returnsLineStatus', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'sku', numeric: false, disablePadding: false, label: 'SKU' },
    { id: 'uomDisplay', numeric: false, disablePadding: false, label: 'UOM' },
    { id: 'expectedQty', numeric: false, disablePadding: false, label: 'Expected Qty', width: 'small' },
    { id: 'totalReceived', numeric: false, disablePadding: false, label: 'Received Qty', width: 'small' },
    { id: 'qtyToReceived', numeric: false, disablePadding: false, label: 'Remaining Qty', width: 'small' },
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
    const classes = useToolbarStyles();
    const { numSelected, onDelete, onReceiveItem } = props;

    return (
        <Toolbar
            className={clsx(classes.root, classes.highlight)}
            variant="dense"
        >
            <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                {numSelected > 0 && `${numSelected} selected`}
            </Typography>
            <Tooltip title="Delete">
                <span><IconButton aria-label="delete" onClick={onDelete} disabled={numSelected === 0}>
                    <DeleteIcon />
                </IconButton></span>
            </Tooltip>
            <Tooltip title="Receive">
                <span><IconButton aria-label="receive" onClick={onReceiveItem} disabled={numSelected === 0}>
                    <FaHandHoldingMedical />
                </IconButton></span>
            </Tooltip>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
    onReceiveItem: PropTypes.func.isRequired
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        flexGrow: 1
    },
    paper: {
        // display: "flex",
        // flexDirection: "column",
        flexGrow: 1,
        width: '100%',
        height: '100%',
        border: ".5px solid #ccc"
    },
    table: {
        // height: "100%",
        width: "100%",
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
        minHeight: "calc(100% - 110px)",
        maxHeight: 0, //this will follow the minHeight. if using calc(100% - 110px) the container will inherit the height of its children hence will overflow
        maxWidth: "100%",
        overflow: "auto"
    },
    tableContainerCollapsed: {
        minHeight: 250,
        maxHeight: 250
    },
    pagination: {
        borderTop: "0.1px solid #ccc",
    },
    unwrapText: {
        whiteSpace: "nowrap"
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
    const { returnsId, rowSelected, setRowSelected, reload, setReload, setHideItemDetails, setReloadHdrTable, setSoftReloadHdrTable } = props;
    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('orderDate');
    const [selected, setSelected] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [pagination, setPagination] = useState({ ...initialPagination })
    const [showReceiving, setShowReceiving] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (returnsId !== null) {
            // if (reload) {
            (async () => {
                if (!isMounted) return
                setLoading(true)
                setSelected([])

                try {
                    const result = await receiveReturnDetailsAPI().getByReturnsId(returnsId, pagination)
                    if (result.status === 200) {
                        if (result.data.code === 0) {
                            addToast(result.data.message, {
                                appearance: "error"
                            })
                        }
                        else {
                            if (result.data.data) {
                                if (!isMounted) return;
                                setRows(result.data.data.retDetailModel);
                                setPagination(result.data.data.pagination);
                            }
                            else {
                                if (!isMounted) return;
                                setRows([]);
                                setPagination({ ...initialPagination })
                            }
                        }

                        if (!isMounted) return
                        setLoading(false);
                        setReload(false)
                    }
                } catch (error) {
                    addToast("Error occurred in getting returns details!", {
                        appearance: "error"
                    })
                    if (!isMounted) return
                    setLoading(false);
                    setReload(false)
                }
            })()
            // }
        }
        else {
            setLoading(false)
            setRows([])
        }

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [reload, returnsId])

    const onDelete = () => {
        if (selected.length > 0) {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this/these item(s)!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    new Promise((resolve, reject) => {
                        selected.forEach(async (returnsLineId, index, array) => {
                            try {
                                const result = await receiveReturnDetailsAPI().delete(returnsLineId)
                                if (result.status === 200) {
                                    if (result.data.code === 0) {
                                        reject(`System could not delete ${returnsLineId}: ${result.data.message}`);
                                        return;
                                    }
                                }
                            } catch (error) {
                                reject(`Error occurred in deleting ${returnsLineId}!`);
                                return;
                            }
                            if (index === array.length - 1) resolve();
                        })
                    })
                        .then(() => {
                            addToast("Items(s) successfully deleted!", {
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
        }
        else {
            addToast("Please select item(s) first.", {
                appearance: "info"
            })
        }
    };

    const onReceiveItem = () => {
        if (selected.length > 1) {
            addToast("Cannot process multiple item receiving", {
                appearance: "info"
            })
        }
        else if (selected.length === 1) {
            const toReceiveItem = rows.filter((value) => value.returnsLineId === selected[0])
            if (toReceiveItem[0].qtyToReceived > 0) {
                setRowSelected(toReceiveItem)
                setShowReceiving(true)
            }
            else {
                addToast("No remaining quantity to be received.", {
                    appearance: "info"
                })
            }
        }
        else {
            addToast("Please select an item first.", {
                appearance: "info"
            })
        }
    };

    const handleAfterReceived = () => {
        setShowReceiving(false);
        setReload(true);
        setSoftReloadHdrTable(true);
        setReloadHdrTable(true);
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.returnsLineId);
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

    const handleRowClick = (event, selectedRow) => {
        setRowSelected([selectedRow]);
        setHideItemDetails(false);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const isRowSelected = (id) => rowSelected.findIndex((item) => item.returnsLineId === id) !== -1;

    return (
        <div className={classes.root}>
            <Receiving
                open={showReceiving}
                onClose={handleAfterReceived}
                itemInfo={rowSelected[0]}
            />
            <Paper className={classes.paper} elevation={0}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    onDelete={onDelete}
                    onReceiveItem={onReceiveItem}
                />
                <TableContainer
                    className={clsx(classes.tableContainer, {
                        // [classes.tableContainerCollapsed]: !collapse
                    })}
                >
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
                                    ? (
                                        <TableRow>
                                            <TableCell colSpan={headCells.length + 1} align="center">
                                                <Typography variant="h5" className={classes.typography}>No added items yet.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.returnsLineId);
                                            const isRowItemSelected = isRowSelected(row.returnsLineId);
                                            const labelId = `po-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected || isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.returnsLineId}
                                                    selected={isItemSelected || isRowItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            onClick={(event) => handleClick(event, row.returnsLineId)}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" id={labelId} scope="row" padding="none" onClick={(event) => handleRowClick(event, row)}>
                                                        {pagination.rowFrom + index}
                                                    </TableCell>
                                                    <TableCell align="left" onClick={(event) => handleRowClick(event, row)}>
                                                        <Chip label={row.poLineStatus} size="small" style={{
                                                            backgroundColor: clsx({
                                                                "#9e9e9e": row.poLineStatus.toUpperCase().includes("CLOSED"),
                                                                "#81c784": row.poLineStatus.toUpperCase().includes("FULLY"),
                                                                "#ffeb3b": row.poLineStatus.toUpperCase().includes("PARTIAL")
                                                            })
                                                        }} />
                                                    </TableCell>
                                                    <TableCell align="left" className={classes.unwrapText} onClick={(event) => handleRowClick(event, row)}>{row.sku}</TableCell>
                                                    <TableCell align="left" className={classes.unwrapText} onClick={(event) => handleRowClick(event, row)}>{row.uomDisplay}</TableCell>
                                                    <TableCell align="left" onClick={(event) => handleRowClick(event, row)}>{Number(row.expectedQty).toLocaleString()}</TableCell>
                                                    <TableCell align="left" onClick={(event) => handleRowClick(event, row)}>{Number(row.totalReceived).toLocaleString()}</TableCell>
                                                    <TableCell
                                                        align="left"
                                                        style={{
                                                            color: clsx({
                                                                "red": Number(row.qtyToReceived) > 0
                                                            })
                                                        }}
                                                        onClick={(event) => handleRowClick(event, row)}
                                                    >
                                                        {Number(row.qtyToReceived).toLocaleString()}
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

        </div >
    );
}

EnhancedTable.propTypes = {
    rowSelected: PropTypes.array.isRequired,
    setRowSelected: PropTypes.func.isRequired,
    reload: PropTypes.bool.isRequired,
    setReload: PropTypes.func.isRequired,
    setReloadHdrTable: PropTypes.func.isRequired,
    setSoftReloadHdrTable: PropTypes.func.isRequired
};

export const ReturnedItemsTable = React.memo(EnhancedTable);
