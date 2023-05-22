import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel
} from '@material-ui/core';

import { getComparator, stableSort } from "../../../../Functions/Util";
import Pagination from "../../../Pagination/Pagination"

const headCells = [
    { id: 'row', numeric: true, disablePadding: true, label: 'Row' },
    { id: 'message', numeric: false, disablePadding: false, label: 'Error Message' },
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
        flexGrow: 1,
        width: '100%',
    },
    paper: {
        flexGrow: 1,
        height: '100%',
        width: '100%',
        marginTop: theme.spacing(2),
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
    const { data } = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('row');
    const [rowSelected, setRowSelected] = React.useState([]);
    const [pagination, setPagination] = useState({
        count: 0,
        currentPage: 1,
        totalPages: 1,
        rowFrom: 0,
        rowTo: 0,
        pageSize: 100
    })

    useEffect(() => {

        // eslint-disable-next-line
    }, [])

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
                            {data.length === 0
                                ? null
                                : stableSort(data, getComparator(order, orderBy))
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
                                                    {index + 1}
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
                    isLoading={false}
                />
            </Paper>
        </div>
    );
}

EnhancedTable.propTypes = {
    data: PropTypes.array.isRequired
};

export const ImportErrorTable = React.memo(EnhancedTable);
