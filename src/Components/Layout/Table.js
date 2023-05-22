import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt1", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich2", 237, 9.0, 37, 4.3),
  createData("Eclair3", 262, 16.0, 24, 6.0),
  createData("Cupcake4", 305, 3.7, 67, 4.3),
  createData("Gingerbread5", 356, 16.0, 49, 3.9),
  createData("Frozen yoghurt6", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich7", 237, 9.0, 37, 4.3),
  createData("Eclair8", 262, 16.0, 24, 6.0),
  createData("Cupcake9", 305, 3.7, 67, 4.3),
  createData("Gingerbread10", 356, 16.0, 49, 3.9),
  createData("Frozen yoghurt11", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich12", 237, 9.0, 37, 4.3),
  createData("Eclair13", 262, 16.0, 24, 6.0),
  createData("Cupcake14", 305, 3.7, 67, 4.3),
  createData("Gingerbread15", 356, 16.0, 49, 3.9),
  createData("Frozen yoghurt16", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich17", 237, 9.0, 37, 4.3),
  createData("Eclair18", 262, 16.0, 24, 6.0),
  createData("Cupcake19", 305, 3.7, 67, 4.3),
  createData("Gingerbread20", 356, 16.0, 49, 3.9),
  createData("Frozen yoghurt21", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich22", 237, 9.0, 37, 4.3),
  createData("Eclair23", 262, 16.0, 24, 6.0),
  createData("Cupcake24", 305, 3.7, 67, 4.3),
  createData("Gingerbread24", 356, 16.0, 49, 3.9),
  createData("Frozen yoghurt26", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich27", 237, 9.0, 37, 4.3),
  createData("Eclair28", 262, 16.0, 24, 6.0),
  createData("Cupcake29", 305, 3.7, 67, 4.3),
  createData("Gingerbread30", 356, 16.0, 49, 3.9),
];

export default function DenseTable() {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow hover key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
