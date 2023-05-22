import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { useToasts } from 'react-toast-notifications';

import { useCustomStyle } from '../../../../../Functions/CustomStyle';

import { localPrinterAPI } from '../../../../../redux/api/api';

const StyledTableCell = withStyles((theme) => ({
    head: {
        // backgroundColor: theme.palette.common.black,
        // color: "whitesmoke",
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.action.hover,
        },
        cursor: "pointer"
    },
}))(TableRow);

const useStyles = makeStyles({
    container: {
        // maxWidth: "50%",
        maxHeight: 500
    },
    table: {
        minWidth: 650,
        // height: ""
    },
});

export default function PrintSetupTable(props) {
    const { formik, setIsLoading, reload, setReload } = props;

    const classes = useStyles();
    const customStyle = useCustomStyle();
    const { addToast } = useToasts();

    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        let isMounted = true;

        if (reload) {
            (async () => {
                setIsLoading(true)
                
                try {
                    const result = await localPrinterAPI().allPrinters()
                    if (result.status === 200) {
                        if (!isMounted) return
                        setRows(result.data.data)
                        setIsLoading(false)
                        setReload(false)
                    }
                } catch (error) {
                    if (!isMounted) return
                    setIsLoading(false)
                    setReload(false)
                    addToast(String(error), {
                        appearance: "error"
                    });
                }
            })()
        }

        return () => isMounted = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload])

    return (
        <TableContainer component={Paper} className={classes.container}>
            <Table aria-label="customized table" className={classes.table}>
                <TableHead className={customStyle.tblHead}>
                    <TableRow>
                        <StyledTableCell>Printer Name</StyledTableCell>
                        <StyledTableCell>IP Address</StyledTableCell>
                        <StyledTableCell>Port</StyledTableCell>
                        <StyledTableCell>Tag Type</StyledTableCell>
                        <StyledTableCell>DPI</StyledTableCell>
                        <StyledTableCell>Default Printer</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow
                            key={row.printerId}
                            onClick={() => formik.setValues({ ...row })}
                        >
                            <StyledTableCell component="th" scope="row">
                                {row.name}
                            </StyledTableCell>
                            <StyledTableCell>{row.ip}</StyledTableCell>
                            <StyledTableCell>{row.port}</StyledTableCell>
                            <StyledTableCell>{row.docTypeId}</StyledTableCell>
                            <StyledTableCell>{row.dpiSizeId.replace("DPI", "")}</StyledTableCell>
                            <StyledTableCell>{String(row.isDefaultInType)}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
