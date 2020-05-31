import OPERATIONS from "./operations.js";

let operationsString = Object.keys(OPERATIONS).join('');
operationsString = operationsString.replace("-", "\\-");

export default {
    canOpenBracket: /.*(?<!(\)|\d|\.))$/,
    canInsertNumber: /.*(?<!(\)))$/,
    canCloseBracket: new RegExp(`.+(?<![${operationsString}\(\.])$`),
    canReplaceOperation: new RegExp(`.+([${operationsString}])$`),
    canInsertOperation: /.+(?<!(\())$/,
    isValid: new RegExp(`.+(?<![${operationsString}])$`),
    cannotInsertPeriod: new RegExp(`.*([${operationsString}]*)(\\d*)(\\.{1})(\\d*)$`),
    deleteExtraZeroes: /0+$|\.0+$/,
}

