import axios from "axios";
// import { sessUser } from "../../Components/Utils/SessionStorageItems";

const accesToken = JSON.parse(localStorage.getItem("apiToken"));

const baseurl = "https://192.168.1.2:5001/api";

const authAxios = axios.create({
  baseURL: baseurl,
  headers: { Authorization: `Bearer ${accesToken}` },
});

const sessUser = JSON.parse(localStorage.getItem("user"));

//dpi 12dpmm = 300dpi || 8dpmm = 203dpi
export const labelaryAPI = (dpi = "12dpmm", size = "3x2") => {
  return {
    convert: (zplCodes) => axios.get(`http://api.labelary.com/v1/printers/${dpi}/labels/${size}/0/${zplCodes}`, {
      responseType: "arraybuffer"
    })
  }
}

export const localPrinterAPI = (url = "http://localhost:8844/api/") => {
  return {
    print: (zplCodes) => axios.post(url + "execprint/processprint", zplCodes),
    doctypes: () => axios.get(url + `PrinterDocTypes/getdoctypes`),
    allPrinters: () => axios.get(url + `IPPrinter/getallprinters`),
    addPrinter: (data) => axios.post(url + `IPPrinter/addipprinter`, data),
    updatePrinter: (data) => axios.post(url + `IPPrinter/updateipprinter`, data),
    deletePrinter: (id) => axios.delete(url + `IPPrinter/deleteipprinter?printerId=${id}`)
  }
}

export const tokenAPI = (url = `/Token/`) => {
  return {
    getToken: () => axios.post(baseurl + url + "gentoken", {TokenAuthUser: "dev", TokenAuthPass: "p@$$w0rd"})
  }
}

/* User's Menu / sys_access API */
export const menuAPI = (url = `/Module/`) => {
  return {
    getbyid: (id) => authAxios.get(url + `getmodulebyid?moduleId=` + id),
    getAll: () => authAxios.get(url + `getmodulepg/`),
    create: (model) => authAxios.post(url + `createmodule`, model),
    update: (model) => authAxios.post(url + `updateAccess/`, model),
    delete: (id) => authAxios.delete(url + id)
  };
};

export const roleAPI = (url = `/AccessRight/`) => {
  return {
    aggregated: (pagination, keyword) => authAxios.post(url + `getaccesrightsspecial?searchKey=${keyword}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    getAll: () => authAxios.get(url + `getaccessrights?pageNum=1&pageItem=1000`),
    getbyid: (id) => authAxios.get(url + `getaccessrightbyid?accessRightId=` + id),
    // create: (header, details) => authAxios.post(url + `createaccessright`, {"header": header, "details": details}),
    create: (header) => authAxios.post(url + `createaccessrightheader`, header),
    update: (header, details) => authAxios.post(url + `updateaccessright`, {"header": header, "details": details}),
    delete: (id) => authAxios.delete(url + `deleteaccessright?accessRightId=` + id + `&userAccountId=` + sessUser)
  };
};

export const roleDetailsAPI = (url = `/AccessRightDetail/`) => {
  return {
    getAll: () => authAxios.get(url + `getaccessrightdetails`),
    // getbyid: (id) => authAxios.get(url + `getaccessrightdetails?accessrightId=` + id),
    getbyid: (id) => authAxios.get(url + `getuseraccessdetails?accesRightId=` + id),
  }
}

export const userAccAPI = (url = `/UserAccount/`) => {
  return {
    login: () => authAxios.post(url + `useraccountvalidationweb`, { "username": "ADMIN", "password": "admin" }),
    aggregated: (pagination, keyword, filters) => authAxios.post(url + `getuseraccountsspecial?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}&searchKey=${keyword}`, filters),
    getAll: () => authAxios.get(url + `getuseraccountpg`),
    getbyid: (id) => authAxios.get(url + `getuseraccountbyid?userAccountId=` + id),
    search: (keyword) => authAxios.get(url + `getuseraccountpgsrch?searchKey=` + keyword),
    create: (newRecord) => authAxios.post(url + `createuseraccount`, newRecord),
    update: (updateRecord) => authAxios.post(url + `updateuseraccount`, updateRecord),
    delete: (id) => authAxios.delete(url + `deleteuseraccount?userAccountId=` + id),
    filter: (filters) => authAxios.post(url + `getuseraccountpgfiltered?pageNum=1&pageItem=1000`, filters)
  };
};

export const configAPI = (url = `/Config/`) => {
  return {
    getAll: () => authAxios.get(url + `getconfigpg`),
    getUOM: () => authAxios.get(url + `getconfiguoms`),
    getbyid: (configType, configName) => authAxios(url + `getconfigbyid?configType=${configType}&configName=${configName}`),
    create: (record) => authAxios.post(url + `createconfig`, record),
    update: (record) => authAxios.post(url + `updateconfig`, record)
  }
}

export const organizationAPI = (url = `/Organization/`) => {
  return {
    getAll: (pagination, keyword, filters) => authAxios.post(url + `getorgspecial?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}&searchKey=${keyword}`, filters),
    getbyid: (id) => authAxios.get(url + `getorganizationbyid?organizationId=` + id),
    search: (keyword, pagination) => authAxios.get(url + `getorgsearchpaged?searchKey=${keyword}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    create: (newRecord) => authAxios.post(url + `createorganization`, newRecord),
    update: (newRecord) => authAxios.post(url + `updateorganization`, newRecord),
    delete: (id) => authAxios.delete(url + `deleteorganization?organizationId=${id}&userAccountId=${sessUser}`),
    filter: (filters) => authAxios.post( url + `getorgfilteredpaged?pageNum=1&pageItem=100`, filters)
  }
}

export const warehouseAPI = (url = `/WarehouseInfo/`) => {
  return {
    getAll: () => authAxios.get(url + `getwarehouseinfopg`),
    update: (newRecord) => authAxios.post(url + `updatewarehouseinfo`, newRecord)
  }
}

export const areasAPI = (url = `/Area/`) => {
  return {
    aggregated: (pagination, keyword) => authAxios.post(url + `getareaspecial?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}&searchKey=${keyword}`),
    getAll: () => authAxios.get(url + `getarea`),
    getbyid: (id) => authAxios.get(url +  `getareabyid?areaId=` + id),
    search: (keyword) => authAxios.get(url + `getareapgsrch?searchKey=` + keyword),
    create: (newRecord) => authAxios.post(url + `createarea`, newRecord),
    update: (newRecord) => authAxios.post(url + `updatearea`, newRecord),
    delete: (id, user) => authAxios.delete(url + `deletearea?areaId=${id}&userAccountId=${user}`)
  }
}

export const locationAPI = (url = `/Location/`) => {
  return {
    getAll: () => authAxios.get(url + `getlocationpg`),
    getAggregate: (pagination, keyword, filters) => authAxios.post(url + `getlocationfltrpaged?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}&searchKey=${keyword}`, filters),
    getbyid: (id) => authAxios.get(url + `getlocationbyid?locationId=` + id),
    create: (newRecord) => authAxios.post(url + `createlocation`, newRecord),
    update: (updateRecord) => authAxios.post(url + `updatelocation`, updateRecord),
    delete: (id) => authAxios.delete(url + `deletelocation?locationId=${id}&userAccountId=${sessUser}`),
    filter: (filters) => authAxios.post(url + `getlocationpgfiltered?pageNum=1&pageItem=5000`, filters),
    getAllAisles: () => authAxios.get(url + `getdistinctaisle`),
    getAllBays: () => authAxios.get(url + `getdistinctbay`),
    getLocByValidationCode: (validationCode) => authAxios.get(url + `definetargetlocation?locVCode=${validationCode}`),
    allInboundLocs: (pagination) => authAxios.get(url + `definetargetlocation?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    defineLPNPutawayLoc: (lpnId, validationCode) => authAxios.get(url + `definelpnputawayloc?lpnId=${lpnId}&locVCode=${validationCode}`)
  };
};

export const locationGroupAPI = (url = `/LocationGroup/`) => {
  return {
    getAll: () => authAxios.get(url + `getlocationgrouppg`),
    getById: (id) => authAxios.get(url + `getlocationgroupbyid?locationGroupId=${id}`),
    search: (keyword) => authAxios.get(url + `getlocationgrouppgsrch?searchKey=${keyword}&pageNum=1&pageItem=1000`),
    create: (data) => authAxios.post(url + `createlocationgroup`, data),
    update: (data) => authAxios.post(url + `updatelocationgroup`, data),
    delete: (id) => authAxios.delete(url + `deletelocationgroup?locationGroupId=${id}&userAccountId=${sessUser}`)
  }
}

export const locationTypeAPI = (url = `/LocationType/`) => {
  return {
    getAll: () => authAxios.get(url + `getlocationtypepg`)
  }
}

export const idNumberAPI = (url = `/IdNumber/`) => {
  return {
    getAll: (pagination) => authAxios.get(url + `getidnumberpg?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    getbyid: (id) => authAxios.get(url + `getidnumberbyid?transactionTypeId=` + id),
    search: (keyword, pagination) => authAxios.get(url + `getidnumberpgsrch?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}&searchKey=` + keyword),
    create: (newRecord) => authAxios.post(url + `createidnumber`, newRecord),
    update: (updateRecord) => authAxios.post(url + `updateidnumber`, updateRecord),
    delete: (id) => authAxios.post(url + `deleteidnumber?transactionTypeId=` + id),
  };
};

export const categoryAPI = (url = `/ProductCategory/`) => {
  return {
    aggregated: (pagination, keyword) => authAxios.post(url + `getproductcatspecial?searchKey=${keyword}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    getAll: () => authAxios.get(url + `getproductcategorypg`),
    getbyid: (id) => authAxios.get(url + `getproductcategorybyid?productCategoryId=` + id),
    search: (keyword) => authAxios.get(url + `getproductcategorypgsrch?searchKey=` + keyword),
    create: (newRecord) => authAxios.post(url + `createproductcategory`, newRecord),
    update: (updateRecord) => authAxios.post(url + `updateproductcategory`, updateRecord),
    delete: (id) => authAxios.delete(url + `deleteproductcategory?userAccountId=${sessUser}&productCategoryId=` + id),
  };
};

export const productAPI = (url = `/Product/`) => {
  return {
    aggregated: (pagination, keyword, filters) => authAxios.post(url + `getproductspecial?searchKey=${keyword}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`, filters),
    getAll: (pagination) => authAxios.get(url + `getproductpaged?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    getbyid: (id) => authAxios.get(url + `getproductbyidmod?sku=` + id),
    search: (keyword) => authAxios.get(url + `getproductpgsrch?searchKey=` + keyword),
    create: (newRecord) => authAxios.post(url + `createproductmod`, newRecord),
    update: (updateRecord) => authAxios.post(url + `updateproductmod`, updateRecord),
    delete: (id) => authAxios.delete(url + `deleteproduct?userAccountId=${sessUser}&sku=` + id),
  };
};

export const productUserFieldsAPI = (url = `/ProductUserField/`) => {
  return {
    getAll: () => authAxios.get(url + `getproductufields`),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const auditTrailAPI = (url = `/AuditTrail/`) => {
  return {
    aggregated: (pagination, keyword, filters) => authAxios.post(url + `getaudittrailspecial?searchKey=${keyword}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`, filters),
    getAll: () => authAxios.get(url + `getaudittrailpg?pageItem=5000`),
    getbyid: (id) => authAxios.get(url + `getaudittrailbyid?auditId=` + id),
    search: (keyword) => authAxios.get(url + `getaudittrailpgsrch?searchKey=` + keyword),
    filter: (filters) => authAxios.post(url + `getaudittrailpgfiltered`, filters)
  };
};

export const readerAPI = (url = `/T_Location_Reader/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const readerAntennaAPI = (url = `/Ui_Location_Reader_Antennas/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const companyInfoAPI = (url = `/Sys_Company/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const purchaseOrderAPI = (url = `/PO/`) => {
  return {
    getAll: (pagination) => authAxios.get(url + `getpopg?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    aggregated: (pagination, keyWord, filters) => authAxios.post(url + `getpospecial?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}&searchKey=${keyWord}`, filters),
    getbyid: (id) => authAxios.get(url + `getpobyid?poId=` + id),
    create: (newRecord) => authAxios.post(url + `createpomod`, newRecord),
    update: (updateRecord) => authAxios.post(url + `updatepomod`, updateRecord),
    delete: (id) => authAxios.delete(url + id),
    search: (keyword, pagination) => authAxios.get(url + `getpopgsrch?searchKey=${keyword}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    filter: (filters, pagination) => authAxios.post(url + ``, filters),
    cancel: (poId) => authAxios.post(url + `cancelpo?poId=${poId}&userAccountId=${sessUser}`),
    forceCancel: (poId) => authAxios.post(url + `forcecancelpo?poId=${poId}&userAccountId=${sessUser}`),
  };
};

export const purchaseOrderDetailsAPI = (url = `/PODetail/`) => {
  return {
    getByPOId: (poId, pagination) => authAxios.get(url + `getpodetailbypoidpagedmod?poId=${poId}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    delete: (poLineId) => authAxios.delete(url + `deletepodetailmod?poLineId=${poLineId}&userAccountId=${sessUser}`)
  }
}

export const purchaseOrderStatusAPI = ( url = `/POStatus/`) => {
  return {
    getAll: () => authAxios.get(url +  `getpostatuspg`)
  }
}

export const receiveReturnAPI = ( url = "/Returns/") => {
  return {
    aggregated: (pagination, keyWord, filters) => authAxios.post(url + `getreturnsspecial?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}&searchKey=${keyWord}`, filters),
    getById: (id) => authAxios.get(url + `getreturnsbyid?returnsId=` + id),
    create: (data) => authAxios.post(url + "createreturnsmod", data),
    update: (data) => authAxios.post(url + "updatereturnsmod", data)
  }
}

export const receiveReturnDetailsAPI = ( url = "/ReturnsDetail/") => {
  return {
    getByReturnsId: (id, pagination) => authAxios.get(url + `getretdetailbyretidpagedmod?returnsId=${id}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    delete: (returnsLineId) => authAxios.delete(url + `deletereturnsdetail?returnsLineId=` + returnsLineId)
  }
}

export const receiveTransfersAPI = ( url = "/WhTransfer/") => {
  return {
    aggregated: (pagination, keyWord, filters) => authAxios.post(url + `getwhtransferspecial?pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}&searchKey=${keyWord}`, filters),
    getById: (id) => authAxios.get(url + `getwhtransferbyid?whTransferId=` + id),
    create: (data) => authAxios.post(url + "createwhtransfermod", data),
    update: (data) => authAxios.post(url + "updatewhtransfermod", data),
    delete: (id) => authAxios.post(url + `deletewhtransfer?whTransferId=${id}`),
  }
}

export const receiveTransfersDetailsAPI = ( url = "/WhTransferDetail/") => {
  return {
    getByTransferId: (id, pagination) => authAxios.get(url + `GetWhTransDetailByTrnasIdPagedMod?whTransId=${id}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    delete: (whTransferLineId) => authAxios.delete(url + `deletereturnsdetail?whTransferLineId=` + whTransferLineId)
  }
}

export const productConditionAPI = ( url = `/ProductCondition/`) => {
  return {
    getAll: () => authAxios.get(url +  `getproductconditionpg`),
    getById: (id) => authAxios.get(url + `getproductconditionbyid?productConditionId=${id}`),
    create: (data) => authAxios.post(url + `createproductcondition`, data),
    update: (data) => authAxios.post(url + `updateproductcondition`, data)
  }
}

export const receivingAPI = (url = `/Receiving/`) => {
  return {
    receive: (data) => authAxios.post(url + `receiving`, data),
    getByPoId: (pagination, poId) => authAxios.get(url + `getreceivesbypoid?poId=${poId}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    cancelReceive: (receivingId, userAccountId) => authAxios.post(url + `cancelreceived?receivingId=${receivingId}&userAccountId=${userAccountId}`)
  }
}

export const returnsReceivingAPI = (url = `/RetReceiving/`) => {
  return {
    receive: (data) => authAxios.post(url + `receiving`, data),
    getByReturnsId: (pagination, returnsId) => authAxios.get(url + `getreceivesbyreturnsid?returnsId=${returnsId}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    cancelReceive: (receivingId, userAccountId) => authAxios.post(url + `cancelreceived?receivingId=${receivingId}&userAccountId=${userAccountId}`)
  }
}

export const whTransferReceivingAPI = (url = `/WhTransReceiving/`) => {
  return {
    receive: (data) => authAxios.post(url + `receiving`, data),
    getByWhTransferId: (pagination, whTransferId) => authAxios.get(url + `getreceivesbywhtransid?whTransId=${whTransferId}&pageNum=${pagination.currentPage}&pageItem=${pagination.pageSize}`),
    cancelReceive: (receivingId, userAccountId) => authAxios.post(url + `cancelreceived?receivingId=${receivingId}&userAccountId=${userAccountId}`)
  }
}

export const putawayAPI = (url = `/PutawayTask/`) => {
  return {
    getTrackIdDetails: (trackId) => authAxios.post(url + `putawayqrytiddetails?trackId=${trackId}&userAccountId=${sessUser}`),
    commitPutaway: (data) => authAxios.post(url + "commitputaway", data),
    queryLPN: (palletId) => authAxios.post(url + `querylpnputaway?palletId=${palletId}`),
    commitLPNPutaway: (data) => authAxios.post(url + `proceedpalletputaway`, data)
  }
}

export const receivingAddressRefAPI = (url = `/T_Receiving_Address/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const addressTypeRefAPI = (url = `/Ui_Address_Type/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const carriersRefAPI = (url = `/Ui_Carrier_Ref/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const paymentMethodRefAPI = (url = `/Ui_Payment_Method/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};


export const paymentTermsRefAPI = (url = `/T_Payment_Terms/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const unitsRefAPI = (url = `/Ui_Uom_Ref/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const salesRepRefAPI = (url = `/Ui_Sales_Rep_Ref/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const currencyAPI = (url = `/T_Currency/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const currencyConversionAPI = (url = `/T_Currency_Conversion/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
    setNewHomeCurrency: (id, updateRecord) =>
      authAxios.put(url + id, updateRecord),
  };
};

export const costingMethodAPI = (url = `/Ui_Costing_Method/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
    setNewHomeCostingMethod: (id, updateRecord) =>
      authAxios.put(url + id, updateRecord),
  };
};



export const pricingSchemeAPI = (url = `/T_Pricing_Scheme/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};


export const taxCodeAPI = (url = `/T_Tax_Code/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
    getbyTaxSchemeId: (id) => authAxios.get(url + id),
  };
};

export const taxSchemeAPI = (url = `/T_Taxing_Scheme/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};


export const companyPreferencesAPI = (url = `/Sys_Global_Company_Preferences/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const docNoFormatAPI = (url = `/Sys_Global_Docnoformat/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};


export const customFieldsAPI = (url = `/Sys_Global_Custom_Fields/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const priceAdjustmentAPI = (url = `/T_Dummy_Price_Adjustment/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const priceAdjustmentLineAPI = (url = `/T_Dummy_Price_Adjustment_Line/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const itemCacheSummaryCostAPI = (url = `/T_Itemcache_Summary_Cost/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};


export const itemPriceAPI = (url = `/T_Item_Price/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
    getAllItemPriceByProduct: (newRecord) => authAxios.post(url, newRecord),
    batchUpdateItemPrice: (newRecord) => authAxios.post(url, newRecord),
  };
};


export const invStockAdjustmentAPI = (url = `/T_Inv_Stock_Adjustment/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const invStockAdjustmentLineAPI = ( url = `/T_Inv_Stock_Adjustment_Line/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const fileAttachmentAPI = (url = `/T_File_Attachment/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
    getbyProduct: (id, file_attachment_type) => 
      authAxios.get(url, {
        params: {
          id: id,
          file_attachment_type: file_attachment_type,
        },
      }),
  };
};

export const productAttachmentAPI = (url = `/T_Product_Attachment/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};


export const productInvAccBalanceAPI = (url = `/T_Account/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const vendorAPI = (url = `/T_Vendor/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};

export const vendorAddressAPI = (url = `/T_Vendor_Address/`) => {
  return {
    getAll: () => authAxios.get(url),
    getbyid: (id) => authAxios.get(url + id),
    create: (newRecord) => authAxios.post(url, newRecord),
    update: (id, updateRecord) => authAxios.put(url + id, updateRecord),
    delete: (id) => authAxios.delete(url + id),
  };
};



