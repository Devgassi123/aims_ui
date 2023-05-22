import React, { useState, useEffect } from "react";
import moment from 'moment';
import {
  Box,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";

import { categoryAPI } from "../../../../redux/api/api";
import { sessUser } from "../../../Utils/SessionStorageItems";
//COMPONENTS
import CategoryAction from "./CategoryAction";
import CentralizedTextField from "../../../Inputs/CentralizedTextField/CentralizedTextField";

const useTabStyles = makeStyles((theme) => ({
  fieldGroup: {
    height: "100%",
    minHeight: 642,
    maxHeight: 642,
    overflow: "auto",
    padding: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
      width: "50%",
    },
  },
}));

const initialCategoryData = {
  productCategoryId: "",
  productCategory: "",
  description: "",
  createdBy: "",
  modifiedBy: "",
  dateCreated: null,
  dateModified: null
}

const CategoryForm = ({ selectedRow, setSelectedRow, setReload, userAllowedActions }) => {
  const classes = useTabStyles();
  const { addToast } = useToasts();

  const [categoryDetails, setCategoryDetails] = useState({ ...initialCategoryData });
  const [disableSave, setDisableSave] = useState(true);

  useEffect(() => {
    if (selectedRow.length > 0) {
      getCategoryDetails()
    }
    else {
      setCategoryDetails({ ...initialCategoryData })
    }
    // eslint-disable-next-line
  }, [selectedRow])

  const getCategoryDetails = async () => {
    try {
      const result = await categoryAPI().getbyid(selectedRow[0])
      if (result.status === 200) {
        setCategoryDetails(result.data.data)
      }
    } catch (error) {
      addToast("Error occurred in getting category details!/n" + error, {
        appearance: "error"
      })
    }
  };

  const handleClickNew = () => {
    setSelectedRow([])
  };

  const handleClickCancel = () => {
    setDisableSave(true)
    if (selectedRow.length > 0) {
      getCategoryDetails()
    }
    else {
      setCategoryDetails({ ...initialCategoryData })
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setDisableSave(false);
    setCategoryDetails({ ...categoryDetails, [name]: value.slice(0, 50) })
  };

  const dataFormatter = (obj) => {
    return {
      ...obj,
      productCategoryId: String(obj.productCategoryId.replace(/[^a-zA-Z0-9]/g, '')).toUpperCase(),
      createdBy: obj.createdBy === "" ? sessUser : obj.createdBy,
      modifiedBy: sessUser,
      dateCreated: obj.createdBy === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : obj.dateCreated,
      dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm")
    }
  };

  const saveChanges = async (event) => {
    event.preventDefault();

    setDisableSave(true);

    const finalValue = dataFormatter(categoryDetails);

    if (String(finalValue.productCategoryId).replace(/\s/g, '').replace(/-/g, '').replace(/_/g, '').length === 0) {
      addToast("Invalid Category ID.", {
        appearance: "error",
      });
      return;
    }

    try {
      let result;
      if (selectedRow.length > 0) {
        if (!userAllowedActions[0].actions.includes("MOD")) {
          addToast("You are not allowed to use update action.", {
            appearance: "error",
          });
          setDisableSave(false);
          return;
        }

        result = await categoryAPI().update(finalValue)
      }
      else {
        if (!userAllowedActions[0].actions.includes("ADD")) {
          addToast("You are not allowed to use add action.", {
            appearance: "error",
          });
          setDisableSave(false);
          return;
        }

        result = await categoryAPI().create(finalValue)
      }

      if (result.status === 200) {
        if (result.data.code === 0) {
          setDisableSave(false);
          addToast(result.data.message, {
            appearance: "error"
          })
        }
        else {
          setReload(true);
          setSelectedRow([]);
          addToast("Saved successfully!", {
            appearance: "success"
          })
        }
      }
    } catch (error) {
      setDisableSave(false);
      addToast("Error occurred in getting category details!/n" + error, {
        appearance: "error"
      })
    }
  };

  return (
    <div>
      <form onSubmit={saveChanges}>
        <CategoryAction isDisabled={disableSave} handleClickNew={handleClickNew} handleClickCancel={handleClickCancel} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Box className={classes.fieldGroup}>
              <CentralizedTextField
                id="productCategoryId"
                name="productCategoryId"
                label="Category ID"
                value={categoryDetails.productCategoryId}
                onChange={handleInputChange}
                disabled={selectedRow.length > 0}
                required
              />
              <CentralizedTextField
                id="productCategory"
                name="productCategory"
                label="Category"
                value={categoryDetails.productCategory}
                onChange={handleInputChange}
                required
              />
              <CentralizedTextField
                id="description"
                name="description"
                label="Description"
                value={categoryDetails.description}
                onChange={handleInputChange}
                required
              />
              <CentralizedTextField
                id="dateCreated"
                label="Date Created"
                value={categoryDetails.dateCreated ? moment(categoryDetails.dateCreated).format('YYYY-MM-DD HH:mm') : ""}
                disabled
              />
              <CentralizedTextField
                id="createdBy"
                label="Created By"
                value={categoryDetails.createdBy}
                disabled
              />
              <CentralizedTextField
                id="dateModified"
                label="Date Modified"
                value={categoryDetails.dateModified ? moment(categoryDetails.dateModified).format('YYYY-MM-DD HH:mm') : ""}
                disabled
              />
              <CentralizedTextField
                id="modifiedBy"
                label="Modified By"
                value={categoryDetails.modifiedBy}
                disabled
              />
            </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CategoryForm;
