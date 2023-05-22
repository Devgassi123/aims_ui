import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Grid,
    Typography,
} from '@material-ui/core';

//COMPONENTS
import ProductCategoryInput from '../Inputs/ProductCategoryInput';
import CentralizedTextField from '../../../../Inputs/CentralizedTextField/CentralizedTextField';
import { UOMRefOptionBox } from '../../../../ReferenceOptionBox/ReferenceOptionBox';

const useStyles = makeStyles((theme) => ({
    grid: {
        padding: "0px 0px"
    },
    gridItem: {
        "& > *": {
            margin: theme.spacing(.75, 0),
            maxWidth: "96%"
        },
        padding: "0px"
    },
    gridItem2: {
        "& > *": {
            margin: theme.spacing(.75, 0),
            maxWidth: "100%",
        },
        alignContent: "right",
        padding: "0px"
    }
}));

function BasicInfos({basicInfo, onChange, clearValue}) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Basic Info
            </Typography>
            <CentralizedTextField 
                id="sku"
                name="sku"
                label="SKU"
                onChange={onChange}
                // disabled={basicInfo.sku.length > 0}
                inputProps={{
                    maxLength: 50
                }}
                required
            />
            <CentralizedTextField 
                id="productName"
                name="productName"
                label="Item Name"
                onChange={onChange}
                inputProps={{
                    maxLength: 100
                }}
                required
            />
            <CentralizedTextField 
                id="description"
                name="description"
                label="Description"
                onChange={onChange}
                inputProps={{
                    maxLength: 200
                }}
            />
            <ProductCategoryInput
                id="productCategoryId"
                name="productCategoryId"
                label="Category"
                onChange={onChange}
                defaultValue={basicInfo.productCategoryId}
                clearValue={clearValue}
                required
            />
            <ProductCategoryInput
                id="productCategoryId2"
                name="productCategoryId2"
                label="Category 2"
                onChange={onChange}
                defaultValue={basicInfo.productCategoryId2}
                clearValue={clearValue}
            />
            <ProductCategoryInput
                id="productCategoryId3"
                name="productCategoryId3"
                label="Category 3"
                onChange={onChange}
                defaultValue={basicInfo.productCategoryId3}
                clearValue={clearValue}
            />
            <UOMRefOptionBox
                id="uomRef"
                name="uomRef"
                label="Unit of Measure"
                defaultValue={basicInfo.uomRef}
                onChange={onChange}
                clearValue={clearValue}
                required
            />
            <Grid container className={classes.grid}>
                <Grid item xs={12} sm={12} md={5} lg={6} xl={6} className={classes.gridItem}>
                    <CentralizedTextField
                        id="createdBy"
                        name="createdBy"
                        label="Created By"
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem2}>
                    <CentralizedTextField
                        id="dateCreated"
                        name="dateCreated"
                        label="Date Created"
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container className={classes.grid}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem}>
                    <CentralizedTextField
                        id="modifiedBy"
                        name="modifiedBy"
                        label="Modified By"
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.gridItem2}>
                    <CentralizedTextField
                        id="dateModified"
                        name="dateModified"
                        label="Date Modified"
                        disabled
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

BasicInfos.propTypes = {
    basicInfo: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    clearValue: PropTypes.bool.isRequired
};

export const BasicInfoForm = React.memo(BasicInfos, (prevProps, nextProps) => {
    if((prevProps.basicInfo === nextProps.basicInfo) && (prevProps.clearValue === nextProps.clearValue)) {
        return true;
    }
    return false;
});