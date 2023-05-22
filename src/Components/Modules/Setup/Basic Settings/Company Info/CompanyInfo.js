import React, { useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setActiveModules } from '../../../../../redux/actions/active_modules';

import { useCustomStyle } from "../../../../../Functions/CustomStyle";
import { CompanyInfoFormMemoized as CompanyInfoForm } from './CompanyInfoForm';
// import { WarehouseForm } from "./WarehouseForm";


export default function CompanyInfo(props) {
    const customStyle = useCustomStyle();

    const userMenu = useSelector((state) => state.menuReducer.data);
    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, []);

    const currentMainModule = userMenu.filter((module) => module.moduleId === "BASICSETT");
    const userAllowedActions = currentMainModule[0].childModules.filter((module) => module.moduleId === "COMPINFO")

    useEffect(() => {
        stableDispatch(setActiveModules("Company Info"));
    }, [stableDispatch]);

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <CompanyInfoForm userAllowedActions={userAllowedActions}/>
            </div>
        </div>
    );
}