import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import {
  CenteralUIColor,
  useCustomStyle,
} from "../../../../Functions/CustomStyle";
//REDUX ACTIONS
import { setActiveModules } from '../../../../redux/actions/active_modules';

//COMPONENTS
import CategoryInfoTab from "./CategoryInfoTab";
import { CategoryTable } from "./CategoryTable";
import { productAPI } from "../../../../redux/api/api";
import { sessUser } from "../../../Utils/SessionStorageItems";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
  tablerow: {
    backgroundColor: CenteralUIColor.HoverBlue,
  },
}));

function Category(props) {
  const classes = useStyles();
  const customstyle = useCustomStyle();
  const { addToast } = useToasts();

  const userMenu = useSelector((state) => state.menuReducer.data);
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);

  const [selectedRow, setSelectedRow] = useState([]);
  const [reload, setReload] = useState(true);

  const currentMainModule = userMenu.filter((module) => module.moduleId === "PRODUCT");
  const userAllowedActions = currentMainModule[0].childModules.filter((module) => module.moduleId === "PRODCAT")

  //DRAG & DROP FUNCTION A START
  const [selectedItems, setSelectedItems] = useState({
    selectedFields: [],
    lastSelectedIndex: -1,
  });

  useEffect(() => {
    stableDispatch(setActiveModules("Categories"));
  }, [stableDispatch]);

  // DRAGGING FUNCTIONS START
  const handleDrag = (e, params) => {
    const draggedItem = JSON.stringify(params);
    e.dataTransfer.setData("DraggedItem", draggedItem);
  };

  const handleDrop = (e, categoryId) => {
    const draggedItem = JSON.parse(e.dataTransfer.getData("DraggedItem"));

    if(draggedItem.products.length > 0) {
      updateProductCategory(draggedItem.products[0], categoryId);
    }
    else {
      addToast("Be sure you have selected first the item before dragging it.", { appearance: "info" });
    }

    console.log("SKU", draggedItem)
    console.log("categoryId", categoryId)

    setSelectedItems({
      selectedFields: [],
      lastSelectedIndex: -1,
    });
  };

  const updateProductCategory = async (item, newCategory) => {
    const updatedDetails = {
      ...item,
      productCategoryId: newCategory,
      modifiedBy: sessUser
    }

    try {
      const result = await productAPI().update(updatedDetails)
      if(result.status === 200) {
        if(result.data.code === 0) {
          addToast(result.data.message, { appearance: "error" });
        }
        else {
          addToast("Success", { appearance: "success" });
        }
      }
    } catch (error) {
      addToast(error, { appearance: "error" });
    }
  }

  // DRAGGING FUNCTIONS A END

  return (
    <div className={customstyle.root}>
      <main className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} md>
            <CategoryTable 
              rowSelected={selectedRow}
              setRowSelected={setSelectedRow}
              reload={reload}
              setReload={setReload}
              handleDrop={handleDrop}
              userAllowedActions={userAllowedActions}
            />
          </Grid>
          <Grid item xs={12} md>
            <CategoryInfoTab
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              setReload={setReload}
              handleDrag={handleDrag}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              userAllowedActions={userAllowedActions}
            />
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

export default Category;
