import React, { useEffect, useState } from 'react';
import { useToasts } from "react-toast-notifications";
import { Box, Checkbox, FormControlLabel, MenuItem } from '@material-ui/core';

import { roleAPI, areasAPI, locationTypeAPI, locationGroupAPI, configAPI, purchaseOrderStatusAPI, productConditionAPI, categoryAPI, localPrinterAPI, organizationAPI, locationAPI } from '../../redux/api/api';

import CentralizedSelectBox from '../Inputs/CentralizedSelectBox/CentalizedSelectBox';

export function RoleOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const getOptions = async () => {
            try {
                const result = await roleAPI().getAll()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions({
                            accessRightId: "",
                            accessRightName: "No Roles Found"
                        })
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting areas!", {
                    appearance: "error"
                })
            }
        }

        getOptions();

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select Role</MenuItem>
            {options.map((option, idx) =>
                <MenuItem key={idx} value={option.accessRightId}>{option.accessRightName}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}

export function AreaOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const getOptions = async () => {
            try {
                const result = await areasAPI().getAll()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions({
                            areaId: "",
                            areaName: "No Area Found"
                        })
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting areas!", {
                    appearance: "error"
                })
            }
        }

        getOptions();

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select Area</MenuItem>
            {options.map((option, idx) =>
                <MenuItem key={idx} value={option.areaId}>{option.areaName}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}

export function LocationTypeOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);
    const [locDetails, setLocDetails] = useState({
    });

    useEffect(() => {
        let isMounted = true;

        const getOptions = async () => {
            try {
                const result = await locationTypeAPI().getAll()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions({
                            locationTypeId: "",
                            locationTypeName: "No Location Type Found"
                        })
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting location types!", {
                    appearance: "error"
                })
            }
        }

        getOptions();

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setLocDetails(options.find(option => option.locationTypeId === props.defaultValue))
    }, [props.defaultValue, options])

    return (
        <Box display="flex">
            <CentralizedSelectBox
                {...props}
            >
                <MenuItem value="" onClick={() => setLocDetails({})}>Select Location Type</MenuItem>
                {options.map((option, idx) =>
                    <MenuItem
                        key={idx}
                        value={option.locationTypeId}
                        onClick={() => setLocDetails(option)}
                    >
                        {option.locationTypeName}
                    </MenuItem>
                )}
            </CentralizedSelectBox>
            <Box ml={2} display="flex">
                <FormControlLabel
                    value="allowPallet"
                    control={<Checkbox color="secondary" />}
                    label="Allow Pallet"
                    labelPlacement="end"
                    checked={locDetails?.allowPallet || false}
                    disabled
                />
                <FormControlLabel
                    value="singlePallet"
                    control={<Checkbox color="secondary" />}
                    label="Single Pallet"
                    labelPlacement="end"
                    checked={locDetails?.singlePallet || false}
                    disabled
                />
            </Box>
        </Box>
    )
}

export function LocationGroupOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function getOptions() {
            try {
                const result = await locationGroupAPI().getAll()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions({
                            locationGroupId: "",
                            locationGroupName: "No Location Group Found"
                        })
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting location groups!", {
                    appearance: "error"
                })
            }
        }

        getOptions()

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select Location Group</MenuItem>
            {options.map((option, idx) =>
                <MenuItem key={idx} value={option.locationGroupId}>{option.locationGroupName}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}

export function UOMRefOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function getOptions() {
            try {
                const result = await configAPI().getUOM()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions({
                            configName: "",
                            description: "No UOM Found"
                        })
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting location groups!", {
                    appearance: "error"
                })
            }
        }

        getOptions()

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select UOM</MenuItem>
            {options.map((option, idx) =>
                <MenuItem key={idx} value={option.configName}>{option.description}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}

export function POStatusOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function getOptions() {
            try {
                const result = await purchaseOrderStatusAPI().getAll()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions({
                            poStatusId: "",
                            poStatus: "No PO Status Found"
                        })
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting P.O. status!", {
                    appearance: "error"
                })
            }
        }

        getOptions()

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select Status</MenuItem>
            {options.map((option, idx) =>
                <MenuItem key={idx} value={option.poStatusId}>{option.poStatus}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}

export function ProductConditionOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function getOptions() {
            try {
                const result = await productConditionAPI().getAll()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions({
                            productConditionId: "",
                            productCondition: "No Product Condition Found"
                        })
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting Product Conditions!", {
                    appearance: "error"
                })
            }
        }

        getOptions()

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select Condition</MenuItem>
            {options.map((option, idx) =>
                <MenuItem key={idx} value={option.productConditionId}>{option.productCondition}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}

export function ProductCategoryOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function getOptions() {
            try {
                const result = await categoryAPI().getAll()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions({
                            productCategoryId: "",
                            productCategory: "No Product Category Found"
                        })
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting Product Categories!", {
                    appearance: "error"
                })
            }
        }

        getOptions()

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select Condition</MenuItem>
            {options.map((option, idx) =>
                <MenuItem key={idx} value={option.productCategoryId}>{option.productCategory}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}

export function TagTypeOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function getOptions() {
            try {
                const result = await localPrinterAPI().doctypes()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions({
                            type: "No Tag Types Found"
                        })
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting Tag Types!", {
                    appearance: "error"
                })
            }
        }

        getOptions()

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select Tag Type</MenuItem>
            {options.map((option, idx) =>
                <MenuItem key={idx} value={option.type}>{option.type}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}

export function CarrierOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const getOptions = async () => {
            try {
                const result = await organizationAPI().filter({
                    organizationTypeId: "CARRIER",
                    inactive: 0
                })
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions([{
                            organizationId: "",
                            organizationName: "No Carriers Found"
                        }])
                    }
                    else {
                        isMounted && setOptions(result.data.data.organization)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting carriers!", {
                    appearance: "error"
                })
            }
        }

        getOptions();

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select Carrier</MenuItem>
            {options && options.map((option, idx) =>
                <MenuItem key={idx} value={option.organizationId}>{option.organizationName}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}

export function AisleOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const getOptions = async () => {
            try {
                const result = await locationAPI().getAllAisles()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions([""])
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting aisles!", {
                    appearance: "error"
                })
            }
        }

        getOptions();

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select Aisle</MenuItem>
            {options && options.map((option, idx) =>
                <MenuItem key={idx} value={option}>{option}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}

export function BayOptionBox(props) {
    const { addToast } = useToasts();

    const [options, setOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const getOptions = async () => {
            try {
                const result = await locationAPI().getAllBays()
                if (result.status === 200) {
                    if (result.data.code === 0) {
                        isMounted && setOptions([""])
                    }
                    else {
                        isMounted && setOptions(result.data.data)
                    }
                }
            } catch (error) {
                addToast("Error occurred in getting bays!", {
                    appearance: "error"
                })
            }
        }

        getOptions();

        return () => isMounted = false;
        // eslint-disable-next-line
    }, [])

    return (
        <CentralizedSelectBox
            {...props}
        >
            <MenuItem value="">Select Bay</MenuItem>
            {options && options.map((option, idx) =>
                <MenuItem key={idx} value={option}>{option}</MenuItem>
            )}
        </CentralizedSelectBox>
    )
}