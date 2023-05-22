import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import {
  MenuItem
} from "@material-ui/core";
import { categoryAPI } from "../../../../../redux/api/api";

import CentralizedSelectBox from '../../../../Inputs/CentralizedSelectBox/CentalizedSelectBox'

const ProductCategoryInput = (props) => {
  const { addToast } = useToasts();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    var isMounted = true;

    const getCategories = async () => {
      try {
        const result = await categoryAPI().getAll();
        if (result.status === 200) {
          if (result.data.code === 0) {
            isMounted && setCategories([{
              productCategoryId: "",
              productCategory: "No registered categories"
            }])
          }
          else {
            isMounted && setCategories(result.data.data)
          }
        }
      } catch (error) {
        addToast(<>Error occurred in getting categories!<br />{error}</>)
      }
    }

    getCategories();

    return () => isMounted = false;
  // eslint-disable-next-line
  }, []);

  return (
    <CentralizedSelectBox
      {...props}
    >
      <MenuItem value={""}>Select Category</MenuItem>
      {categories.map((row) => (
        <MenuItem key={row.productCategoryId} value={row.productCategoryId}>{row.productCategory}</MenuItem>
      ))}
    </CentralizedSelectBox>
  );
};

export default ProductCategoryInput;
