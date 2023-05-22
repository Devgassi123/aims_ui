import React, { useEffect, useState } from 'react';
import { useToasts } from "react-toast-notifications";
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import { useDispatch } from 'react-redux';
import { roleDetailsAPI } from '../../../../../redux/api/api';
import { createRoleDetails, selectAllRoleActions, updateRoleDetails } from '../../../../../redux/actions/role_details';

import { sessUser } from '../../../../Utils/SessionStorageItems';

import { TableLoad } from '../../../../Layout/Loader';

import moment from 'moment';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    container: {
        maxHeight: 550,
    },
    disabledCursor: {
        cursor: "not-allowed"
    }
});

export default function ActionsTable({ roleName, setDisableActions, setShowBackdrop }) {
    const classes = useStyles();
    const { addToast } = useToasts();

    const dispatch = useDispatch();

    const [rows, setRows] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function getRoleRights(roleId) {
            isMounted && setLoading(true);
            try {
                const result = await roleDetailsAPI().getbyid(roleId);
                if (result.status === 200) {
                    if (!isMounted) return;
                    treeConverter(result.data.data);
                    dispatch(createRoleDetails(result.data.data))
                }
            } catch (error) {
                addToast("Error occurred in getting role rights!", {
                    appearance: "error",
                });
                isMounted && setLoading(false)
                console.log("ERROR", `${error}`)
            }
        };

        if (roleName.length > 0) {
            // console.log("roleName", roleName)
            getRoleRights(roleName)
        }
        else {
            setRows({})
        }
        // eslint-disable-next-line
    }, [roleName])

    const treeConverter = (data) => {
        var modules = {};

        // filter the data to get the distinct module
        const distinctModules = data.filter((ele, ind) => ind === data.findIndex((elem) => (elem.headerModuleId === ele.headerModuleId) && (elem.headerModuleId === ele.headerModuleId)))

        new Promise((resolve, reject) => {
            // make module as the object key and construct its value to also have a "children" sub-key
            distinctModules.forEach(function (item, index, array) {
                modules[item.headerModuleId] = {
                    moduleId: item.headerModuleId,
                    moduleName: item.moduleName,
                    children: []
                };
                if (index === array.length - 1) resolve();
            });

        })
            .then(result => {
                // push the item to the variable: module with same headerModuleId
                data.forEach(function (item) {
                    modules[item.headerModuleId].children.push(item);
                })
            })
            .then(result => {
                setRows(modules);
                setLoading(false);
                console.log("MODULES", modules);
            })
    };

    const dataFormatter = (obj) => {
        return {
            ...obj,
            moduleId: obj.headerModuleId,
            accessRightId: roleName[0],
            actionTypeId: obj.headerActionTypeId,
            dateCreated: obj.dateCreated === "" ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : obj.dateCreated,
            dateModified: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            createdBy: obj.createdBy === null ? sessUser : obj.createdBy,
            modifiedBy: sessUser
        }
    };

    const handleOnChangeDetails = (event, origDetails) => {
        setDisableActions(false);

        dispatch(updateRoleDetails(dataFormatter({ ...origDetails, allow: event.target.checked })))

        // if (event.target.checked) {
        //     dispatch(updateRoleDetails(dataFormatter({...origDetails, allow: event.target.checked})))
        // }
        // else {
        //     dispatch(deleteRoleDetails(origDetails))
        // }
    };

    const handleAllowAllActions = (event, moduleId) => {
        setDisableActions(false);
        dispatch(selectAllRoleActions({ module: moduleId, allow: event.target.checked }))

        // select all input elements with name attribute containing "chk" + moduleId
        let checkboxes = document.querySelectorAll(`input[name*=chk${moduleId}]`);

        // loop through the checkboxes and do something
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].disabled === false) {
                checkboxes[i].checked = event.target.checked;
                console.log("checkboxes", checkboxes[i])
            }
        }
    }

    return (
        <TableContainer component={Paper} className={classes.container}>
            <Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Modules</TableCell>
                        <TableCell>ALL</TableCell>
                        <TableCell>VIEW</TableCell>
                        <TableCell>ADD</TableCell>
                        <TableCell>MODIFY</TableCell>
                        <TableCell>DELETE</TableCell>
                        <TableCell>IMPORT</TableCell>
                        <TableCell>EXPORT</TableCell>
                        <TableCell>REPORTS</TableCell>
                        <TableCell>INVENTORY</TableCell>
                        <TableCell>RECEIVING</TableCell>
                        <TableCell>CANCEL RECEIVED</TableCell>
                        <TableCell>PUTAWAY</TableCell>
                        <TableCell>PICKING</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading
                        ? <TableLoad cols={13} count={5} />
                        : Object.keys(rows).length === 0
                            ? (<TableRow>
                                <TableCell colSpan={13}>
                                    <center>Select role to load details</center>
                                </TableCell>
                            </TableRow>)
                            : Object.values(rows).map((value) =>
                                <TableRow key={value.moduleId}>
                                    <TableCell component="th" scope="row">
                                        {value.moduleName}
                                    </TableCell>

                                    <TableCell component="th" scope="row">
                                        <Checkbox
                                            id={`chk${value.moduleName}ALL`}
                                            name={`chk${value.moduleName}ALL`}
                                            defaultChecked={false}
                                            onChange={(event) => handleAllowAllActions(event, value.moduleId)}
                                        />
                                    </TableCell>

                                    {value.children.map((child, index) =>
                                        <TableCell
                                            key={index}
                                            className={child.enabled ? "" : classes.disabledCursor}
                                        >
                                            {/* Cannot use Checkbox from MUI due to it can checked using javascript */}
                                            {/* <Checkbox
                                                id={`chk${child.headerModuleId}${child.headerActionTypeId}`}
                                                name={`chk${child.headerModuleId}${child.headerActionTypeId}`}
                                                defaultChecked={child.allow}
                                                onChange={(event) => handleOnChangeDetails(event, child)}
                                                disabled={!child.enabled}
                                            /> */}
                                            <input
                                                type='checkbox'
                                                id={`chk${child.headerModuleId}${child.headerActionTypeId}`}
                                                name={`chk${child.headerModuleId}${child.headerActionTypeId}`}
                                                defaultChecked={child.allow}
                                                onChange={(event) => handleOnChangeDetails(event, child)}
                                                disabled={!child.enabled}
                                            />
                                        </TableCell>
                                    )}
                                </TableRow>
                            )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// export default ModuleActionsTable;
export const ModuleActionsTable = React.memo(ActionsTable, (prevProps, nextProps) => {
    if (prevProps.roleName === nextProps.roleName) {
        return true;
    }
    return false;
});
