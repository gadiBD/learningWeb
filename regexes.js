import operations from "./operations.js";

let operationsString = Object.keys(operations).join('');
if (operationsString.includes('-')) {
    operationsString = operationsString.replace("-", "\\-");
}

export default {
    canOpenBracket: /.*(?<!(\)|\d|\.))$/,
    canInsertNumber: /.*(?<!(\)))$/,
    canCloseBracket: new RegExp(`.+(?<![${operationsString}\(])$`),
    canReplaceOperation: new RegExp(`.+([${operationsString}])$`),
    canInsertOperation: /.+(?<!(\())$/,
    isValid: new RegExp(`.+(?<![${operationsString}])$`),
    cannotInsertPeriod: new RegExp(`.*([${operationsString}]*)(\\d*)(\\.{1})(\\d*)$`),
    deleteExtraZeroes: /0+$|\.0+$/,
}

