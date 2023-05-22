import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import {
    Box,
    Checkbox,
    IconButton,
    InputAdornment,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography
} from '@material-ui/core';
import { 
    Delete as DeleteIcon, 
    FirstPage as FirstPageIcon, 
    KeyboardArrowLeft, KeyboardArrowRight,
    LastPage as LastPageIcon,
    Search as SearchIcon
} from '@material-ui/icons';
import swal from 'sweetalert';
import { useToasts } from 'react-toast-notifications';

import { locationGroupAPI } from '../../../../redux/api/api';
//FUNCTIONS
import { CenteralUIColor } from "../../../../Functions/CustomStyle"
import { getComparator, stableSort } from "../../../../Functions/Util";
//COMPONENTS
import { TableLoad } from "../../../Layout/Loader";
import NoData from "../../../NoData/NoData";
// import AreasFilters from "./AreasFilters";

const headCells = [
    { id: 'locationGroupId', numeric: false, disablePadding: true, label: 'Group ID' },
    { id: 'locationGroupName', numeric: false, disablePadding: false, label: 'Group Name' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' }
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
    // const customStyle = useCustomStyle();
    const classes = useToolbarStyles();
    const { numSelected, onSearch, onDelete } = props;

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
                    Location Groups
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" color='secondary' onClick={onDelete} >
                        <DeleteIcon color="error" />
                    </IconButton>
                </Tooltip>
            ) : (
                <Box display="flex">
                    <Box mr={1}>
                        <Tooltip title="Search Area ID, Warehouse ID, Area Desc...">
                            <TextField 
                                id="txtSearch"
                                label="Search"
                                variant="outlined"
                                size="small"
                                margin="dense"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                                }}
                                onKeyDown={onSearch}
                                style={{backgroundColor: "white"}}
                            />
                        </Tooltip>
                    </Box>
                </Box>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
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
    const { rowSelected, setRowSelected, reload, setReload, userAllowedActions } = props;
    const { addToast } = useToasts();
    const classes = useStyles();
    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('locationGroupName');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        let isMounted = true;

        async function getLocationGroups() {
            isMounted && setLoading(true);
            try {
                const result = await locationGroupAPI().getAll()
                if(result.status === 200) {
                    if(result.data.data) {
                        isMounted && setRows(result.data.data);
                    }
                    else {
                        isMounted && setRows([])
                    }
                    if(!isMounted) return;
                    setLoading(false);
                    setReload(false);
                }
            } catch (error) {
                if(!isMounted) return;
                setLoading(false);
                setReload(false);
                addToast("Error occurred in getting areas!", {
                    appearance: "error"
                })
            }
        }

        if(reload) {
            getLocationGroups();
        }

        return () => isMounted = false;
    // eslint-disable-next-line
    }, [reload])

    const onSearch = async (event) => {
        if (event.key === 'Enter') {
            setLoading(true);
            setRowSelected([]);
            setSelected([]);

            if (event.target.value.length > 0) {
                try {
                    const result = await locationGroupAPI().search(event.target.value)
                    if (result.status === 200) {
                        if (result.data.data) {
                            setRows(result.data.data)
                        }
                        else {
                            setRows([]);
                        }
                        setLoading(false);
                    }
                } catch (error) {
                    addToast("Error occurred in searching!", {
                        appearance: "error"
                    })
                }
            }
            else {
                setReload(true);
            }
        }
    };

    const onDelete = () => {
        if(!userAllowedActions[0].actions.includes("DEL")){
            addToast("You are not allowed to use delete action.", {
                appearance: "error",
            });
            return;
        }
        
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this/these area(s)!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                new Promise((resolve, reject) => {
                    selected.forEach(async (locationGroupId, index, array) => {
                        try {
                            const result = await locationGroupAPI().delete(locationGroupId)
                            if (result.status === 200) {
                                if (result.data.code === 0) {
                                    reject(`System could not delete ${locationGroupId}. Please try again.`);
                                    return;
                                }
                            }
                        } catch (error) {
                            console.log("ERROR", error)
                            reject(`Error occurred in deleting ${locationGroupId}!`);
                            return;
                        }
                        if (index === array.length - 1) resolve();
                    })
                })
                    .then(() => {
                        addToast("Location Group(s) successfully deleted!", {
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
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.locationGroupId);
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
        const selectedIndex = rowSelected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(id);
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

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const isRowSelected = (id) => rowSelected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar 
                    numSelected={selected.length}
                    onSearch={onSearch}
                    onDelete={onDelete}
                />
                <TableContainer className={classes.tableContainer}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        aria-label="location groups table"
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
                                ? <TableLoad count={rowsPerPage} cols={headCells.length + 1} />
                                : rows.length === 0
                                    ? <NoData />
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.locationGroupId);
                                            const isRowItemSelected = isRowSelected(row.locationGroupId);
                                            const labelId = `areas-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected || isRowItemSelected}
                                                    tabIndex={-1}
                                                    key={row.locationGroupId}
                                                    onClick={(event) => handleRowClick(event, row.locationGroupId)}
                                                    selected={isItemSelected || isRowItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            onClick={(event) => handleClick(event, row.locationGroupId)}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" id={labelId} scope="row" padding="none">
                                                        {row.locationGroupId}
                                                    </TableCell>
                                                    <TableCell align="left">{row.locationGroupName}</TableCell>
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
                    className={clsx({[classes.pagination]: emptyRows > 0}) }
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
    userAllowedActions: PropTypes.array.isRequired
};

export const LocationGroupsTable = React.memo(EnhancedTable);
