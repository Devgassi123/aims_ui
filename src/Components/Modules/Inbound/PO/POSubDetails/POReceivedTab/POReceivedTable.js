import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Checkbox,
    Chip,
    IconButton,
    Menu, MenuItem,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Toolbar, Tooltip, Typography
} from '@material-ui/core';
import { GiCancel } from 'react-icons/gi';
import { IoFileTrayStackedSharp } from 'react-icons/io5';
import { useToasts } from 'react-toast-notifications';
import swal from 'sweetalert';
// API
import { receivingAPI, returnsReceivingAPI, whTransferReceivingAPI } from '../../../../../../redux/api/api';
// FUNCTIONS
import { CenteralUIColor } from "../../../../../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../../../../../Functions/Util";
// COMPONENTS
import { TableLoad } from "../../../../../Layout/Loader";
import Pagination from '../../../../../Pagination/Pagination';
import { sessUser } from '../../../../../Utils/SessionStorageItems';
import Putaway from '../../../Putaway/TIDPutaway/Putaway';
import LPNPutaway from '../../../Putaway/LPNPutaway/LPNPutaway';

const headCells = [
    { id: 'receivingId', numeric: false, disablePadding: true, label: 'Receiving Id', width: 'small' },
    { id: 'receivingStatusId', numeric: false, disablePadding: false, label: 'Status', width: 'medium' },
    { id: 'sku', numeric: false, disablePadding: false, label: 'SKU', width: '110px' },
    { id: 'qtyTo', numeric: false, disablePadding: false, label: 'Received Qty', width: 'small' },
    { id: 'uomDisplay', numeric: false, disablePadding: false, label: 'UOM' },
    { id: 'trackIdTo', numeric: false, disablePadding: false, label: 'Tracking ID', width: 'small' },
    { id: 'lpnTo', numeric: false, disablePadding: false, label: 'LPN No', width: 'small' },
    { id: 'locationTo', numeric: false, disablePadding: false, label: 'Location', width: 'small' },
    { id: 'productCondition', numeric: false, disablePadding: false, label: 'Condition', width: 'small' },
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
                        disabled
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
    const { numSelected, onCancelReceiving, onPutawayItem, onLPNPutaway } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Toolbar
            className={clsx(classes.root, classes.highlight)}
            variant="dense"
        >
            <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                {numSelected > 0 && `${numSelected} selected`}
            </Typography>
            <Tooltip title="Cancel Received">
                <span><IconButton aria-label="receive" onClick={onCancelReceiving} disabled={numSelected === 0}>
                    <GiCancel />
                </IconButton></span>
            </Tooltip>
            <Tooltip title="Putaway">
                <span>
                    <IconButton aria-label="putaway" aria-controls="putaway-menu" aria-haspopup="true" onClick={handleOpenMenu}>
                        <IoFileTrayStackedSharp />
                    </IconButton>
                    <Menu
                        id="putaway-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem onClick={onPutawayItem}>Track ID Putaway</MenuItem>
                        <MenuItem onClick={onLPNPutaway}>LPN Putaway</MenuItem>
                    </Menu>
                </span>
            </Tooltip>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onCancelReceiving: PropTypes.func.isRequired,
    onPutawayItem: PropTypes.func.isRequired,
    onLPNPutaway: PropTypes.func.isRequired
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        flexGrow: 1
    },
    paper: {
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
        maxHeight: 0,
        height: "100%",
        maxWidth: "100%",
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
    const { documentNo, documentType, rowSelected, setRowSelected, reload, setReload, setHideItemDetails, setReloadHdrTable, setSoftReloadHdrTable } = props;
    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('receivingId');
    const [selected, setSelected] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [pagination, setPagination] = useState({ ...initialPagination })
    const [showPutaway, setShowPutaway] = useState(false);
    const [showLPNPutaway, setShowLPNPutaway] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (reload || (documentNo !== null)) {
            (async () => {
                if (!isMounted) return
                setLoading(true)
                setSelected([])

                let result;
                try {
                    switch (documentType) {
                        case "PO":
                            result = await receivingAPI().getByPoId(pagination, documentNo)
                            break;
                        case "RETURNS":
                            result = await returnsReceivingAPI().getByReturnsId(pagination, documentNo)
                            break;
                        case "WHTRANSFERS":
                            result = await whTransferReceivingAPI().getByWhTransferId(pagination, documentNo)
                            break;
                        default:
                            break;
                    }

                    if (result.status === 200) {
                        if (result.data.data) {
                            if (!isMounted) return;
                            setRows(result.data.data.receives);
                            setPagination(result.data.data.pagination);
                            setSelected([]);
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
                    addToast("Error occurred in getting received items!", {
                        appearance: "error"
                    })
                    if (!isMounted) return
                    setLoading(false);
                    setReload(false)
                }
            })()
        }
        else {
            setLoading(false)
            setRows([])
        }

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [reload, documentNo])

    const onCancelReceiving = () => {
        swal({
            title: "Are you sure?",
            text: "This will undo the receiving and all Serial Numbers for this Tracking ID",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                new Promise((resolve, reject) => {
                    rowSelected.forEach(async (receiving, index, array) => {
                        try {
                            let result;
                            switch (documentType) {
                                case "PO":
                                    result = await receivingAPI().cancelReceive(receiving.receivingId, sessUser)
                                    break;
                                case "RETURNS":
                                    result = await returnsReceivingAPI().cancelReceive(receiving.receivingId, sessUser)
                                    break;
                                case "WHTRANSFERS":
                                    result = await whTransferReceivingAPI().cancelReceive(receiving.receivingId, sessUser)
                                    break;
                                default:
                                    break;
                            }
                            if (result.status === 200) {
                                if (result.data.code === 0) {
                                    reject(`System could not cancel ${receiving.receivingId}. Please try again.`);
                                    return;
                                }
                            }
                        } catch (error) {
                            reject(`Error occurred in cancelling ${receiving.receivingId}!`);
                            return;
                        }
                        if (index === array.length - 1) resolve();
                    })
                })
                    .then(() => {
                        addToast("Items(s) successfully unreceived!", {
                            appearance: "success",
                        });
                        setSelected([]);
                        setRowSelected([]);
                        setReload(true);
                        setSoftReloadHdrTable(true);
                        setReloadHdrTable(true);
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

    const onPutawayItem = () => {
        if (rowSelected.length > 0) {
            if (rowSelected.length === 1) {
                if (rowSelected[0].receivingStatus.toUpperCase() === "CREATED") {
                    setShowPutaway(true)
                }
                else {
                    addToast("Cannot be putaway.", {
                        appearance: "info"
                    })
                }
            }
            else {
                addToast("Putaway one at a time.", {
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

    const onClosePutaway = () => {
        setShowPutaway(false)
        setShowLPNPutaway(false)
        setReload(true);
        setSoftReloadHdrTable(true);
        setReloadHdrTable(true);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.receivingId);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, trackId) => {
        const selectedIndex = selected.indexOf(trackId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [trackId];
        }
        else if (selectedIndex > 0) {
            newSelected = [];
        }

        setSelected(newSelected);
    };

    const handleRowClick = (event, selectedRow) => {
        //commented codes below due to "rowSelected" is currently using in onCancelReceiving function
        // const selectedIndex = rowSelected.findIndex((item) => item.receivingId === selectedRow.receivingId);
        // let newSelected = [];

        // if (selectedIndex === -1) {
        //     newSelected = [selectedRow];
        //     // setHideItemDetails(false);
        // } else {
        //     newSelected = [];
        //     // setHideItemDetails(true);
        // }

        // setRowSelected(newSelected);
        setRowSelected([selectedRow]);
        setHideItemDetails(true);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const isRowSelected = (id) => rowSelected.findIndex((item) => item.trackIdTo === id) !== -1;

    return (
        <div className={classes.root}>
            <Putaway
                open={showPutaway}
                onClose={onClosePutaway}
                itemInfo={rowSelected[0]}
            // itemInfo={{documentNo: "PO01", sku: "SKU01"}}
            />
            <LPNPutaway
                open={showLPNPutaway}
                onClose={onClosePutaway}
                itemInfo={{ documentNo: documentNo, ...rowSelected[0] }}
            // itemInfo={{documentNo: "PO01", sku: "SKU01"}}
            />
            <Paper className={classes.paper} elevation={0}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    onCancelReceiving={onCancelReceiving}
                    onPutawayItem={onPutawayItem}
                    onLPNPutaway={() => setShowLPNPutaway(true)}
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
                                    ? (
                                        <TableRow>
                                            <TableCell colSpan={headCells.length + 1} align="center">
                                                <Typography variant="h5" className={classes.typography}>No received items yet.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    : stableSort(rows, getComparator(order, orderBy))
                                        // .filter((row) => !row.receivingStatus.toUpperCase().includes("CLOSE"))
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.trackIdTo);
                                            const isRowItemSelected = isRowSelected(row.trackIdTo);
                                            const labelId = `received-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected || isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.receivingId}
                                                    onClick={(event) => handleRowClick(event, row)}
                                                    selected={isItemSelected || isRowItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            onClick={(event) => handleClick(event, row.trackIdTo)}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left" className={classes.unwrapText} padding="none">{row.receivingId}</TableCell>
                                                    <TableCell align="left" >
                                                        <Chip
                                                            label={row.receivingStatus}
                                                            size="small"
                                                            style={{
                                                                backgroundColor: clsx({
                                                                    "#81c784": row.receivingStatus.toUpperCase().includes("CLOSE"),
                                                                    "#e57373": row.receivingStatus.toUpperCase().includes("CANCEL"),
                                                                })
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left" className={classes.unwrapText}>{row.sku}</TableCell>
                                                    {/* <TableCell align="left">{row.documentNo}</TableCell> */}
                                                    <TableCell align="left">{Number(row.qtyTo).toLocaleString()}</TableCell>
                                                    <TableCell align="left" className={classes.unwrapText}>{row.uomDisplay}</TableCell>
                                                    <TableCell align="left" className={classes.unwrapText}>{row.trackIdTo}</TableCell>
                                                    <TableCell align="left" className={classes.unwrapText}>{row.lpnTo}</TableCell>
                                                    <TableCell align="left">{row.locationTo}</TableCell>
                                                    <TableCell align="left">{row.productCondition}</TableCell>
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
        </div >
    );
}

EnhancedTable.propTypes = {
    documentNo: PropTypes.any.isRequired,
    rowSelected: PropTypes.array.isRequired,
    setRowSelected: PropTypes.func.isRequired,
    reload: PropTypes.bool.isRequired,
    setReload: PropTypes.func.isRequired,
    setReloadHdrTable: PropTypes.func.isRequired
};

export const POReceivedTable = React.memo(EnhancedTable);
