import React, { useCallback, useEffect, useState } from 'react';
import { 
    Grid 
} from '@material-ui/core';

import { useDispatch } from 'react-redux';
import { setActiveModules } from '../../../../../redux/actions/active_modules';

import { useCustomStyle } from "../../../../../Functions/CustomStyle";
import { UserAccountsTable } from './UserAccountsTable';
import { UserAccountFormMemoized as UserAccountForm } from './UserAccountsForm';

export default function UserAccounts(props) {
    const customStyle = useCustomStyle();

    const dispatch = useDispatch();
    const stableDispatch =  useCallback(dispatch, []);

    const [rowSelected, setRowSelected] = React.useState([]);
    const [reload, setReload] = useState(true);

    useEffect(() => {
        stableDispatch(setActiveModules("User Accounts"));
    }, [stableDispatch]);

    return (
        <div className={customStyle.root}>
            <div className={customStyle.content}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <UserAccountsTable  
                            rowSelected={rowSelected}
                            setRowSelected={setRowSelected}
                            reload={reload}
                            setReload={setReload}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <UserAccountForm 
                            selectedRow={rowSelected} 
                            setSelectedRow={setRowSelected} 
                            setReload={setReload}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}