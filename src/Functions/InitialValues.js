export const initialRoleValues = {
    role_id: 0,
    role_name: "",
    role_description: "",
    created_at: "",
    updated_at: "",
    created_by: 0,
    created_by_account_name: "",
};

const initialUserAccountValues = {
    account_id: 0,
    account_name: "",
    account_email: "",
    account_password: "",
    confirm_password: "",
    created_at: "",
    updated_at: "",
    created_by: 0,
    created_by_account_name: "",
    role_id: 0,
};

export const initialUserValues = {
    role: initialRoleValues,
    accessRights: [],
    userAccounts: initialUserAccountValues,
};

export const initialOrgData = {
    organizationID: 0,
    organizationName: null,
    description: null,
    organizationTypeID: 0,
    shortCode: null,
    address: null,
    address2: null,
    telephone: null,
    telephone2: null,
    phone: null,
    phone2: null,
    email: null,
    email2: null,
    province: null,
    city: null,
    district: null,
    street: null,
    zipCode: null,
    defaultCarrierID: 0,
    dateCreated: new Date(),
    dateModified: new Date(),
    createdBy: null,
    modifiedBy: null,
    inactive: 0,
    remarks: null
};