import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
// import { useToasts } from 'react-toast-notifications';

import { getComparator, stableSort } from "../../../../Functions/Util";
// import { TableLoad } from "../../../Layout/Loader";
// import NoData from "../../../NoData/NoData";

const headCells = [
    { id: 'row', numeric: true, disablePadding: true, label: 'Row' },
    { id: 'tagId', numeric: false, disablePadding: true, label: 'Tag ID' },
    { id: 'epc', numeric: false, disablePadding: false, label: 'EPC' },
    { id: 'serialno', numeric: false, disablePadding: false, label: 'Serial #' },
    { id: 'remarks', numeric: false, disablePadding: false, label: 'Remarks' },
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
        marginTop: theme.spacing(5)
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
        minHeight: 300,
        maxHeight: 300
    },
    pagination: {
        borderTop: "0.1px solid #ccc",
    },
    unwrapText: {
        whiteSpace: "nowrap"
    }
}));

function EnhancedTable(props) {
    const { serialNos } = props;
    const classes = useStyles();
    // const { addToast } = useToasts();

    const [rowSelected, setRowSelected] = React.useState([])
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('row');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleRowClick = (event, id) => {
        // const selectedIndex = rowSelected.indexOf(id);
        // let newSelected = [];

        // if (selectedIndex === -1) {
        //     newSelected = newSelected.concat(id);
        // } else {
        //     newSelected = [];
        // }

        // setRowSelected(newSelected);
        setRowSelected([id]);
    };

    const removeSerialNo = (index) => {
        serialNos.splice(index, 1);
        //const newSerialNos = serialNos.filter(serial => serial.)
    }

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
                        <caption>Catched Serial Numbers will be shown here.</caption>
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />

                        <TableBody>
                            {serialNos.length !== 0
                                && stableSort(serialNos, getComparator(order, orderBy))
                                    .map((row, index) => {
                                        const isRowItemSelected = isRowSelected(row.tagId);
                                        const labelId = `serialno-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isRowItemSelected}
                                                tabIndex={-1}
                                                key={row.tagId}
                                                onClick={(event) => handleRowClick(event, row.tagId)}
                                                selected={isRowItemSelected}
                                            >
                                                <TableCell component="th" id={labelId} scope="row" align="right">
                                                    <Box display="flex">
                                                        <CloseIcon htmlColor='#f44336' onClick={() => removeSerialNo(index)} />
                                                        <Box ml={1}>{index + 1}</Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" padding='none' className={classes.unwrapText}>{row.tagId}</TableCell>
                                                <TableCell align="left" className={classes.unwrapText}>{row.epc}</TableCell>
                                                <TableCell align="left" className={classes.unwrapText}>{row.serialno}</TableCell>
                                                <TableCell align="left" className={classes.unwrapText}>{row.remarks}</TableCell>
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
    // palletId: PropTypes.string.isRequired,
};

export const ReceivingSerialNosTable = React.memo(EnhancedTable);
