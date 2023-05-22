import moment from "moment";

export const distinctModuleArray = (originData) => {
  const uniq = originData.filter(function ({ moduleId }) {
    return !this[moduleId] && (this[moduleId] = moduleId);
  }, {});

  console.log("distinctModuleArray", uniq);
  return uniq;
};

export const modifiedModuleDesc = (originData) => {
  // const uniq = originData.filter(function ({ parentName }) {
  //   return (
  //     !this[parentName] &&
  //     (this[parentName] = parentName)
  //   );
  // }, {});

  const uniq = originData.filter(function ({ parentName }) {
    return (
      !this[parentName] &&
      (this[parentName] = parentName)
    );
  }, {});

  console.log("UNIQ", uniq)
  const ret = uniq.map(
    ({
      moduleId,
      moduleName,
      seqNum,
      description,
      parentName,
      icon,
      image,
      url
    }) => ({
      moduleId: moduleId,
      moduleName: moduleName,
      seqNum: seqNum,
      description: description,
      parentName: parentName,
      icon: icon,
      image: image,
      url: url,
      parent: 1
    })
  );
  return ret;
};

export const parentChildConverter = (flat) => {
  var roots = []; // things without parent

  // make them accessible by guid on this map
  var all = {};

  flat.forEach(function (item) {
    all[item.moduleName] = item;
  });

  // connect childrens to its parent, and split roots apart
  return new Promise((resolve, reject) => {
    Object.keys(all).forEach(function (moduleName) {
      var item = all[moduleName];

      new Promise((resolve, reject) => {
        if (!("Children" in item)) {
          item.Children = [];
        }
        resolve();
      })
        .then(result => {
          //means parent
          if (item.parentName === item.moduleName) {
            roots.push(item);
          }
          else {
            var parent = all[item.parentName];
            parent.Children.push(item);
          }
        })
    });
    resolve(roots);
  })
};

export const standardDateTimeFormatter = (dateTime) => {
  return new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000)
    .toISOString().split(".")[0];
};

export const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const populateFields = (data) => {
  let numberFields = ["qtyToReceived", "totalReceived", "expectedQty"];
  let dateFields = ["orderDate", "arrivalDate", "accountExpiry", "returnDate", "transferDate"]

  // console.log("DATA", data)

  Object.entries(data).forEach(([key, value]) => {
    let element = document.querySelector(`[name=${key}]`);
    // let element = document.querySelector(`#${key}`);
    if (element) {
      if(numberFields.indexOf(key) !== -1) {
        element.value = Number(value)
        // console.log("NUMBER ELEMENT", element)
      }
      else if (String(key).includes("date")) {
        element.value = value ? moment(value).format("YYYY-MM-DD HH:mm") : ""
        // console.log("DATE TIME ELEMENT", element)
      } 
      else if (dateFields.indexOf(key) !== -1) {
        // console.log("HERE")
        element.value = value ? moment(value).format("yyyy-MM-DD") : ""
        // console.log("DATE ELEMENT", element)
      }
      else if (String(key).includes("password")) {
        element.value = value ? "passwordencrypted": ""
      }
      else {
        element.value = value || ""
        // console.log("ELEMENT", element)
      }
    }
  })
};



