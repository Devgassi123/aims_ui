import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  CenteralUIColor,
  useCustomStyle,
} from "../../../../Functions/CustomStyle";

import { setActiveModules } from "../../../../redux/actions/active_modules";

import { ProductListForm } from "./ProductListForm/ProductListForm";
import { ProductListTable } from "./ProductListTable";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: CenteralUIColor.HoverBlue,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
  contentWrapper: {
    margin: theme.spacing(1),
  },
}));

const Product = () => {
  const classes = useStyles();
  const customstyle = useCustomStyle();

  const [itemSelected, setItemSelected] = React.useState([]);
  const [reload, setReload] = useState(true);

  const userMenu = useSelector((state) => state.menuReducer.data);
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);

  const currentMainModule = userMenu.filter((module) => module.moduleId === "PRODUCT");
  const userAllowedActions = currentMainModule[0].childModules.filter((module) => module.moduleId === "PRODLIST")

  useEffect(() => {
    stableDispatch(setActiveModules("Product List"));
  }, [stableDispatch])

  return (
    <div className={customstyle.root}>
      <main className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <ProductListTable
              rowSelected={itemSelected}
              setRowSelected={setItemSelected}
              reload={reload}
              setReload={setReload}
              userAllowedActions={userAllowedActions}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <ProductListForm 
              selectedRow={itemSelected} 
              setRowSelected={setItemSelected} 
              setReload={setReload}
              userAllowedActions={userAllowedActions}
            />
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export default Product;
