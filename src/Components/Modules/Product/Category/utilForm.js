import { useState } from "react";

const UseForm = (initialState) => {
  const [categoryFinalValues, setCategoryFinalValues] = useState(
    initialState
  );
  const [categoryErrors, setCategoryErrors] = useState({});

  //   /* Category input change Event */
  function handleCategoryChange(values, errors) {
    setCategoryFinalValues({
      ...categoryFinalValues,
      category: values,
    });
  }

  

  return {
    categoryFinalValues,
    setCategoryFinalValues,
    categoryErrors,
    setCategoryErrors,
    handleCategoryChange,
  };
};

export default UseForm;
