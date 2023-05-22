import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel
} from '@material-ui/core';

import { putawayAPI } from '../../../../../redux/api/api';
import { useToasts } from 'react-toast-notifications';

import { getComparator, stableSort } from "../../../../../Functions/Util";
import { TableLoad } from "../../../../Layout/Loader";
import NoData from "../../../../NoData/NoData";

const headCells = [
    { id: 'row', numeric: true, disablePadding: true, label: 'Row' },
    { id: 'trackIdTo', numeric: false, disablePadding: true, label: 'Tracking ID' },
    { id: 'sku', numeric: false, disablePadding: false, label: 'SKU' },
    { id: 'productName', numeric: false, disablePadding: false, label: 'Product Name' },
    { id: 'qtyTo', numeric: false, disablePadding: false, label: 'Qty' },
    { id: 'uomRef', numeric: false, disablePadding: false, label: 'UOM' },
    { id: 'locationTo', numeric: false, disablePadding: false, label: 'Current Location' },
    { id: 'lpnTo', numeric: false, disablePadding: false, label: 'Current LPN' },
    { id: 'lotAttributeId', numeric: false, disablePadding: false, label: 'LOT ID' },
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
        minHeight: 500,
        maxHeight: 500
    },
    pagination: {
        borderTop: "0.1px solid #ccc",
    }
}));

function EnhancedTable(props) {
    const { palletId, setLPNDetails } = props;
    const classes = useStyles();
    const { addToast } = useToasts();

    const [rowSelected, setRowSelected] = React.useState([])
    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('row');
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        let isMounted = true;

        if (palletId.length > 0) {
            (async () => {
                isMounted && setLoading(true)
                try {
                    const result = await putawayAPI().queryLPN(palletId)
                    if (result.status === 200) {
                        if (result.data.data) {
                            if (isMounted) {
                                setRows(result.data.data);
                                setLPNDetails(result.data.data)
                            }
                        }
                        if (!isMounted) return
                        setLoading(false);
                    }
                } catch (error) {
                    addToast("Error occurred in getting pallet details!", {
                        appearance: "error"
                    })
                    if (!isMounted) return
                    setRows([]);
                    setLPNDetails([])
                    setLoading(false);
                }
            })()
        }

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [palletId])

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
                                            const isRowItemSelected = isRowSelected(row.trackIdTo);
                                            const labelId = `lpn-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.trackIdTo}
                                                    onClick={(event) => handleRowClick(event, row.trackIdTo)}
                                                    selected={isRowItemSelected}
                                                >
                                                    <TableCell component="th" id={labelId} scope="row" align="right" padding='checkbox'>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell align="left" padding='none' width="200px">{row.trackIdTo}</TableCell>
                                                    <TableCell align="left" width="150px">{row.sku}</TableCell>
                                                    <TableCell align="left" width="200px">{row.productName}</TableCell>
                                                    <TableCell align="left">{row.qtyTo}</TableCell>
                                                    <TableCell align="left">{row.uomRef}</TableCell>
                                                    <TableCell align="left">{row.locationTo}</TableCell>
                                                    <TableCell align="left" width="300px">{row.lpnTo}</TableCell>
                                                    <TableCell align="left" width="300px">{row.lotAttributeId}</TableCell>
                                                </TableRow>
                                            );
                                        })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}

EnhancedTable.propTypes = {
    palletId: PropTypes.string.isRequired,
};

export const LPNPutawayItemsTable = React.memo(EnhancedTable);
