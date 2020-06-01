import OPERATIONS from "./operations.js";

let operationsString = Object.keys(OPERATIONS).join("");
operationsString = operationsString.replace("-", "\\-");

export default {
  canOpenBracket: (text) => /.*(?<!(\)|\d|\.))$/.test(text),
  canInsertNumber: (text) => /.*(?<!(\)))$/.test(text),
  canNegativeSign: (text) => new RegExp(`.*([${operationsString}])$`).test(text),
  canCloseBracket: (text) => new RegExp(`.+(?<![${operationsString}\(\.])$`).test(text),
  canReplaceOperation: (text) => new RegExp(`.+([${operationsString}])$`).test(text),
  canInsertOperation: (text) => {
    return /.+(?<!(\(|\.))$/.test(text) || /.*(\d+)(\.{1})$/.test(text);
  },
  isValid: (text) => new RegExp(`.+(?<![${operationsString}])$`).test(text),
  canInsertPeriod: (text) =>
    !new RegExp(`.*([${operationsString}]*)(\\d*)(\\.{1})(\\d*)$`).test(text),
  deleteExtraZeroes: (text) => /0+$|\.0+$/.test(text),
};
