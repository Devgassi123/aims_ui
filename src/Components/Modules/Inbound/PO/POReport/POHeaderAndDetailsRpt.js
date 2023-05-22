import React from 'react';
import Barcode from 'react-barcode';
import { useParams } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'

import { purchaseOrderAPI, purchaseOrderDetailsAPI } from '../../../../../redux/api/api';
import moment from 'moment';


function POHeaderAndDetailsRpt() {
    const { poId } = useParams();

    const [poHdrData, setPOHdrData] = React.useState({})
    const { addToast } = useToasts()

    React.useEffect(() => {
        getPODetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poId])

    const getPODetails = async () => {
        try {
            const result = await purchaseOrderAPI().getbyid(poId)
            if (result.status === 200) {
                setPOHdrData(result.data.data)
            }
        } catch (error) {
            addToast("Error occurred in getting order details!", {
                appearance: "error"
            })
        }
    };

    return (
        <Box width="100vw" maxWidth="100vw" overflowY="hidden">
            <Box width="100%" maxWidth="100vw" display="flex">
                <Box flexGrow={1}>
                    <Typography variant='h4'>Company Name</Typography>
                    <Typography variant='h5'>Address</Typography>
                    <Typography variant='h5'>Contact #</Typography>
                    <Typography variant='h5'>Email address</Typography>
                </Box>
                <Box>
                    <Box width="100%" maxWidth="100vw" display="flex" flexDirection="column">
                        <Barcode
                            value="PO-000047"
                            displayValue={false}
                            width={2}
                            height={70}
                            margin={0}
                        />
                        <Typography variant='h5'>PO#: {poHdrData?.poId}</Typography>
                        <Typography variant='h6'>Order Date: {moment(poHdrData?.orderDate).format("YYYY-MM-DD HH:mm") }</Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                border="2px solid #ccc"
                borderRadius="5px"
                width="100%"
                maxWidth="calc(100vw - 20px)"
                display="flex"
                marginTop={2}
                marginBottom={3}
                padding={1}
            >
                <Box flexGrow={1}>
                    <Typography gutterBottom><b>Reference #: {poHdrData?.refNumber}</b></Typography>
                    <Typography gutterBottom><b>Arrival Date #: {moment(poHdrData?.arrivalDate).format("YYYY-MM-DD HH:mm")}</b></Typography>
                    <Typography gutterBottom><b>Remarks: {poHdrData?.remarks}</b></Typography>
                </Box>
                <Box flexGrow={1}>
                    <Typography gutterBottom><b>Supplier: {poHdrData?.supplierName}</b></Typography>
                    <Typography gutterBottom><b>Supplier Address: {poHdrData?.supplierAddress}</b></Typography>
                    <Typography gutterBottom><b>Contact #: {poHdrData?.supplierContat}</b></Typography>
                </Box>
                <Box flexGrow={1}>
                    <Typography gutterBottom><b>Carrier: {poHdrData?.carrierName}</b></Typography>
                    <Typography gutterBottom><b>Carrier Address: {poHdrData?.carrierAddress}</b></Typography>
                    <Typography gutterBottom><b>Contact #: {poHdrData?.carrierContact}</b></Typography>
                </Box>
            </Box>
            <ReportTable poId={poId} />
        </Box>
    )
};


const StyledTableCell = withStyles((theme) => ({
    head: {
        borderBottom: "2px solid #424242",
        paddingBottom: "5px"
    },
    body: {
        fontSize: 12,
    },
}))(TableCell);

const RemarksTableCell = withStyles((theme) => ({
    body: {
        fontSize: 10,
        backgroundColor: "#e0e0e0",
        padding: theme.spacing(1)
    },
}))(TableCell);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
        maxWidth: "100vw"
    },
});

function ReportTable(poId) {
    const classes = useStyles();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([])
    const [pagination, setPagination] = React.useState({
        count: 0,
        currentPage: 1,
        totalPages: 1,
        rowFrom: 0,
        rowTo: 0,
        pageSize: 1000,
        fromSearch: false
    })

    React.useEffect(() => {
        getPOItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poId])

    const getPOItems = async () => {
        try {
            const result = await purchaseOrderDetailsAPI().getByPOId(poId.poId, pagination)
            if (result.status === 200) {
                if (result.data.data) {
                    setRows(result.data.data.poDetailModel);
                    setPagination(result.data.data.pagination);
                }
                else {
                    setRows([]);
                }
            }
        } catch (error) {
            addToast("Error occurred in getting order details!", {
                appearance: "error"
            })
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Line #</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>SKU</StyledTableCell>
                        <StyledTableCell>UOM</StyledTableCell>
                        <StyledTableCell>Order Qty</StyledTableCell>
                        <StyledTableCell>Received Qty</StyledTableCell>
                        <StyledTableCell>Remaining Qty</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <React.Fragment>
                            <TableRow key={row.poLineId}>
                                <StyledTableCell component="th" scope="row">
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell>{row.poLineStatus}</StyledTableCell>
                                <StyledTableCell>{row.sku}</StyledTableCell>
                                <StyledTableCell>{row.uomDisplay}</StyledTableCell>
                                <StyledTableCell>{row.orderQty}</StyledTableCell>
                                <StyledTableCell>{row.totalReceived}</StyledTableCell>
                                <StyledTableCell>{row.qtyToReceived}</StyledTableCell>
                            </TableRow>
                            {row.remarks?.length > 0 && (
                                <TableRow>
                                    <RemarksTableCell colSpan={7}>Remarks: {row.remarks}</RemarksTableCell>
                                </TableRow>
                            )}

                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default POHeaderAndDetailsRpt;