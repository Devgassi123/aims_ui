// import { revertMd5 } from "./MD5Converter";

// export const sessUser = revertMd5(JSON.parse(sessionStorage.getItem("user")));
// export const sessRole = revertMd5(JSON.parse(sessionStorage.getItem("role")));

export const sessUser = JSON.parse(localStorage.getItem("user"));
export const sessRole = JSON.parse(localStorage.getItem("role"));