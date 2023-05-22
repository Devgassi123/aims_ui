import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import menuReducer from "./reducers/menu";
import roleReducer from "./reducers/roles";
import roleDetailsReducer from "./reducers/role_details";
import sysActionReducer from "./reducers/sysaction";
import sysmoduleReducer from "./reducers/sysmodule";
import userAccReducer from "./reducers/useraccount";
import sysAccessReducer from "./reducers/sysaccess";
import locationReducer from "./reducers/location";
import readerReducer from "./reducers/reader"
import readerAntennaReducer from "./reducers/reader_antenna";
import companyInfoReducer from "./reducers/company_info";
import countryRefReducer from "./reducers/country_ref";
import receivingAddressRefReducer from "./reducers/receiving_address_ref";
import addressTypeRefReducer from "./reducers/address_type";
import carriersRefReducer from "./reducers/carriers_ref";
import paymentMethodRefReducer from "./reducers/payment_method_ref";
import paymentTermsRefReducer from "./reducers/payment_terms_ref";
import unitsRefReducer from "./reducers/units_ref";
import salesRepRefReducer from "./reducers/sales_rep_ref";
import currencyReducer from "./reducers/currency";
import currencyConversionReducer from "./reducers/currency_conversion";
import costingMethodReducer from "./reducers/costing_method";
import pricingSchemeReducer from "./reducers/pricing_scheme";
import taxCodeReducer from "./reducers/tax_code";
import taxSchemeReducer from "./reducers/tax_scheme";
import companyPreferencesReducer from "./reducers/company_preferences";
import docNoFormatReducer from "./reducers/doc_no_format";
import customFieldsReducer from "./reducers/custom_fields";
import categoryReducer from "./reducers/category";
import categoryProductReducer from "./reducers/category_product";
import pinReducer from "./reducers/pin";
import productReducer from "./reducers/product";
import summaryCostReducer from "./reducers/cache_summary_cost";
import itemPriceReducer from "./reducers/item_price";
import priceAdjustmentReducer from "./reducers/price_adjustment";
import priceAdjustmentLineReducer from "./reducers/price_adjustment";
import stockAdjustmentReducer from "./reducers/stock_adjustment";
import stockAdjustmentLineReducer from "./reducers/stock_adjustment_line";
import fileAttachmentReducer from "./reducers/file_attachment";
import productAttachmentReducer from "./reducers/product_attachment";
import vendorReducer from "./reducers/vendor";
import vendorAddressReducer from "./reducers/vendor_address";
import activeModulesReducer from "./reducers/active_modules";
import zonesReducer from "./reducers/zones";

const middlewares = compose(applyMiddleware(thunk, logger));

const reducers = combineReducers({
    menuReducer: menuReducer,
    roleReducer: roleReducer,
    roleDetailsReducer: roleDetailsReducer,
    userAccReducer: userAccReducer,
    sysmoduleReducer: sysmoduleReducer,
    sysActionReducer: sysActionReducer,
    sysAccessReducer: sysAccessReducer,
    locationReducer: locationReducer,
    readerReducer: readerReducer,
    readerAntennaReducer: readerAntennaReducer,
    companyInfoReducer: companyInfoReducer,
    countryRefReducer: countryRefReducer,
    receivingAddressRefReducer: receivingAddressRefReducer,
    addressTypeRefReducer: addressTypeRefReducer,
    carriersRefReducer: carriersRefReducer,
    paymentMethodRefReducer: paymentMethodRefReducer,
    paymentTermsRefReducer: paymentTermsRefReducer,
    unitsRefReducer: unitsRefReducer,
    salesRepRefReducer: salesRepRefReducer,
    currencyReducer: currencyReducer,
    currencyConversionReducer: currencyConversionReducer,
    costingMethodReducer: costingMethodReducer,
    pricingSchemeReducer: pricingSchemeReducer,
    taxCodeReducer: taxCodeReducer,
    taxSchemeReducer: taxSchemeReducer,
    companyPreferencesReducer: companyPreferencesReducer,
    docNoFormatReducer: docNoFormatReducer,
    customFieldsReducer: customFieldsReducer,
    categoryReducer: categoryReducer,
    categoryProductReducer: categoryProductReducer,
    pinReducer: pinReducer,
    productReducer: productReducer,
    summaryCostReducer,
    itemPriceReducer,
    priceAdjustmentReducer,
    priceAdjustmentLineReducer,
    stockAdjustmentReducer,
    stockAdjustmentLineReducer,
    fileAttachmentReducer,
    productAttachmentReducer,
    vendorReducer,
    vendorAddressReducer,
    activeModulesReducer,
    zonesReducer
});

export default createStore(reducers, middlewares);
