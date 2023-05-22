import { useState } from "react";

var initialLocationBasicInfo = {
    locationID: null,
    locationName: null,
    description: null,
    locationTypeId: null,
    locationGroupId: null,
    areaId: null,
    inactive: 0,
    dateCreated: new Date(),
    dateModified: new Date(),
    createdBy: null,
    modifiedBy: null
};

var initialLocationPositionInfo = {
    validationCode: null,
    aisleCode: null,
    bayCode: null,
};

export default function LocationDetails() {
    const [basicInfo, setBasicInfo] = useState({...initialLocationBasicInfo});
    const [positionInfo, setPositionInfo] = useState({...initialLocationPositionInfo});
    const [locationFinalValues, setLocationFinalValues] = useState({...basicInfo, ...positionInfo});

    // alert("RENDER")

    const handleLocationInfoChange = (event) => {
        setBasicInfo({...basicInfo, locationName: event.target.value});
        setLocationFinalValues({...locationFinalValues, locationName: event.target.value})
    }

    return {
        basicInfo,
        setBasicInfo,
        positionInfo,
        setPositionInfo,
        locationFinalValues,
        handleLocationInfoChange
    }
    
}