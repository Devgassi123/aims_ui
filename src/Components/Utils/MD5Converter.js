import md5 from "md5";
import reverseMd5 from "reverse-md5";

export function convertToMd5(string) {
    return md5(string);
}

export function revertMd5(md5) {
    var rev = reverseMd5({
        lettersUpper: true,
        lettersLower: true,
        numbers: true,
        special: true,
        whitespace: true,
        maxLen: 10
    })

    if(md5 === null) return null;
    return rev(md5).str;
    // return "ADMIN"
    // example return: {str: "hello world", elapse: 1.4734763}
}