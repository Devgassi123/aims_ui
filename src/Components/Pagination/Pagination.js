import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Box, IconButton, NativeSelect, TextField, Typography } from '@material-ui/core';
import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft, KeyboardArrowRight,
    LastPage as LastPageIcon,
} from '@material-ui/icons';

const usePaginationStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "flex-end",
        borderTop: "1px solid #cccccc",
        minHeight: "55px"
    },
    select: {
        marginRight: theme.spacing(2),
    },
    currentPage: {
        width: "4ch",
        margin: theme.spacing(0, 1),
        padding: theme.spacing(0, 0, 1, 0),
        textAlign: "center"
    }
}));

export default function Pagination({ pagination, setPagination, isLoading, setReload }) {
    const { count, currentPage, totalPages, rowFrom, rowTo, fromSearch } = pagination;

    const classes = usePaginationStyles();
    const theme = useTheme();

    const goToFirstPage = () => {
        if (isLoading) return
        setPagination({ ...pagination, currentPage: 1 })
        !fromSearch && setReload(true)
    }

    const goToLastPage = () => {
        if (isLoading) return
        setPagination({ ...pagination, currentPage: pagination.totalPages })
        !fromSearch && setReload(true)
    }

    const goToNextPage = () => {
        if (isLoading) return
        setPagination({
            ...pagination,
            currentPage: (pagination.currentPage < pagination.totalPages)
                ? pagination.currentPage + 1
                : pagination.totalPages
        })
        !fromSearch && setReload(true)
    }

    const goToPrevPage = () => {
        if (isLoading) return
        setPagination({
            ...pagination,
            currentPage: (pagination.currentPage > 1)
                ? pagination.currentPage - 1
                : 1
        })
        !fromSearch && setReload(true)
    }

    const handleChangePageSize = (event) => {
        if (!isLoading) {
            setPagination({
                ...pagination,
                pageSize: event.target.value
            });
            !fromSearch && setReload(true)
        }
    }

    const handleChangeCurrentPage = (event) => {

        if(event.target.value.length === 0) {
            setPagination({
                ...pagination,
                currentPage: event.target.value
            });
        }

        if (/^\d+$/.test(event.target.value)) {
            setPagination({
                ...pagination,
                currentPage: event.target.value
            });
        }

    }

    const handleApplyCurrentPage = (event) => {
        if (event.key === "Enter") {
            if (Number(currentPage) > totalPages) {
                setPagination({
                    ...pagination,
                    currentPage: totalPages
                });
            }
            else if (Number(currentPage) < 1) {
                setPagination({
                    ...pagination,
                    currentPage: 1
                });
            }
            else {
                setPagination({
                    ...pagination,
                    currentPage: event.target.value
                });

            }
            !fromSearch && setReload(true)
        }
    }

    return (
        <div className={classes.root}>
            <Box marginRight="20px" display="flex" alignItems="center">
                <Typography variant="body2" color='inherit' htmlFor="rowsPerPage">Rows per page:</Typography>
                <NativeSelect
                    id="rowsPerPage"
                    name="rowsPerPage"
                    className={classes.select}
                    value={pagination.pageSize}
                    onChange={handleChangePageSize}
                    disabled={isLoading}
                    disableUnderline
                >
                    <option value="100">100</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                </NativeSelect>
            </Box>
            <Box marginRight="20px">
                <Typography variant="body2" color='inherit'>Row {rowFrom} to {rowTo} of {count}</Typography>
            </Box>
            <IconButton
                onClick={goToFirstPage}
                disabled={currentPage === 1 || isLoading}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={goToPrevPage}
                disabled={currentPage === 1 || isLoading}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <Box display="flex">
                <Typography variant="body2" color='inherit'>Page</Typography>
                <TextField
                    id="currentPage"
                    name="currentPage"
                    label=""
                    value={currentPage}
                    disabled={isLoading}
                    onChange={(event) => handleChangeCurrentPage(event)}
                    onKeyDown={(event) => handleApplyCurrentPage(event)}
                    InputProps={{
                        classes: {
                            input: classes.currentPage
                        }
                    }}
                />
                <Typography variant="body2" color='inherit'>of {totalPages}</Typography>
            </Box>
            <IconButton
                onClick={goToNextPage}
                disabled={currentPage === totalPages || isLoading}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={goToLastPage}
                disabled={currentPage === totalPages || isLoading}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div >
    );
}

Pagination.propTypes = {
    pagination: PropTypes.object.isRequired,
    setPagination: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    setReload: PropTypes.func
};