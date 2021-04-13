import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const CustomTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: "1em",
    height: "500px",
    overflowY: "auto",
  },
  table: {
    maxWidth: "100%",
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
  },
});

function TableRenderer(props) {
  const { classes, rowData } = props;

  const sortData = (first, second) => second.cases - first.cases;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Countries</CustomTableCell>
            <CustomTableCell align="right">Total Cases</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData.sort(sortData).map((row) => (
            <TableRow className={classes.row} key={row.country}>
              <CustomTableCell component="th" scope="row">
                {row.country}
              </CustomTableCell>
              <CustomTableCell align="right">{row.cases}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

TableRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableRenderer);
