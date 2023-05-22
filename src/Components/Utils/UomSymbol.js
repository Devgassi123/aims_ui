import { InputAdornment } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanyPreferences,
} from "../../redux/actions/company_preferences";
import {lengthUoms, weigthUoms} from '../Settings/BaseSettings/CompanyPreferencesForm';

const UomSymbol = (props) => {
    const {uomType, position} = props;
    const companyPreferences = useSelector(
      (state) => state.companyPreferencesReducer.document
    );
    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, []);
    const [defaultUom, setDefaultUom] = useState({});
    useEffect(() => {
      stableDispatch(getCompanyPreferences());
    }, [stableDispatch]);


    const setUomValue = () =>{
        let LengthUomVal = "";
        let WeigthUomVal = "";
        const companyPreferencesFirstItemValue = companyPreferences.find(
          (x) => x !== undefined
        );
        LengthUomVal =
          companyPreferences.length !== 0 &&
          lengthUoms.find(
            (x) =>
              x.length_uom_type ===
              companyPreferencesFirstItemValue.length_uom_type
          ).symbol;

        WeigthUomVal =
          companyPreferences.length !== 0 &&
          weigthUoms.find(
            (x) =>
              x.weight_uom_type ===
              companyPreferencesFirstItemValue.weight_uom_type
          ).symbol;
        setDefaultUom({
          LengthUom: LengthUomVal,
          WeigthUom: WeigthUomVal,
        });
    }

    const setUomValueCallBack = useCallback(setUomValue, [companyPreferences]);

    useEffect(() => {
      setUomValueCallBack();
    }, [setUomValueCallBack]);

    if (uomType === 'Length') {
        return (
          <InputAdornment position={position}>
            {defaultUom.LengthUom || ""}
          </InputAdornment>
        );
    }else{
        return (
           
          <InputAdornment position={position}>
            {defaultUom.WeigthUom || ""}
          </InputAdornment>
        );
    }
    
}

export default UomSymbol;
