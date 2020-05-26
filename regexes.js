import operations from "./operations.js";

let operationsString = Object.keys(operations).join('');
if (operationsString.includes('-')) {
    operationsString = operationsString.replace("-", "\\-");
}

alert(operationsString);

export default {
    canOpenBracket: /.*(?<!(\)|\d|\.))$/,
    canInsertNumber: /.*(?<!(\)))$/,
    canCloseBracket: new RegExp(`.+(?<![${operationsString}\()])$`),


}

