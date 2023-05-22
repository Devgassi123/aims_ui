import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Paper,
  Tab, Tabs,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  CenteralUIColor,
  useCustomStyle,
} from "../../../../Functions/CustomStyle";
//COMPONENTS
import { CategoryProductsTable } from "./CategoryProductsTable";
import CategoryForm from "./CategoryForm";

/* // TAB INFORMATION */
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
};

const useTabStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const dndStyle = makeStyles((theme) => ({
  tablerow: {
    backgroundColor: CenteralUIColor.LightestBrown,
  },
}));

function CategoryInfoTab({ selectedRow, setSelectedRow, setReload, handleDrag, selectedItems, setSelectedItems, userAllowedActions }) {
  const classes = useTabStyles();
  const customstyle = useCustomStyle();
  const dndClasses = dndStyle();

  const [tabIndexValue, setTabIndexValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndexValue(newValue);
  };

  //DRAGGING FUNCTIONS B START

  const handleItemSelection = (data, index, cmdKey, shiftKey) => {
    let selectedFields;
    const fields = data;
    const field = index < 0 ? "" : fields[index];
    const lastSelectedIndex = index;

    if (!cmdKey && !shiftKey) {
      selectedFields = [field];
    } 
    else if (shiftKey) {
      if (selectedItems.lastSelectedIndex >= index) {
        selectedFields = [].concat.apply(
          selectedItems.selectedFields,
          fields.slice(index, selectedItems.lastSelectedIndex)
        );
      } 
      else {
        selectedFields = [].concat.apply(
          selectedItems.selectedFields,
          fields.slice(selectedItems.lastSelectedIndex + 1, index + 1)
        );
      }
    } 
    else if (cmdKey) {
      const foundIndex = selectedItems.selectedFields.findIndex(
        (f) => f === field
      );
      // If found remove it to unselect it.
      if (foundIndex >= 0) {
        selectedFields = [
          ...selectedItems.selectedFields.slice(0, foundIndex),
          ...selectedItems.selectedFields.slice(foundIndex + 1),
        ];
      } 
      else {
        selectedFields = [...selectedItems.selectedFields, field];
      }
    }
    const finalList = fields
      ? fields.filter((f) => selectedFields.find((a) => a === f))
      : [];

    setSelectedItems({ selectedFields: finalList, lastSelectedIndex });
  };

  const getSelectedStyle = (sku) => {
    if (selectedItems.selectedFields.length !== 0) {
      const isExist = selectedItems.selectedFields.some(
        (x) => x.sku === sku
      );

      return isExist ? dndClasses.tablerow : null;
    }

    return null;
  };

  //DRAGGING FUNCTIONS B END
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Tabs
          value={tabIndexValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ className: customstyle.indicator }}
          variant="scrollable"
          scrollButtons="on"
          aria-label="scrollable auto tabs example"
          className={customstyle.tab}
        >
          <Tab label="Category Info" {...a11yProps(0)} />
          <Tab label="Products" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={tabIndexValue} index={0}>
          <CategoryForm
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            setReload={setReload}
            userAllowedActions={userAllowedActions}
          />
        </TabPanel>
        <TabPanel value={tabIndexValue} index={1}>
          <CategoryProductsTable  
            categoryId={selectedRow[0] || ""}
            onSelect={handleItemSelection}
            onDrag={handleDrag} 
            selectedItems={selectedItems}
            selectedStyle={getSelectedStyle}
          />
        </TabPanel>
      </Paper>
    </div>
  );
}

export default CategoryInfoTab;
