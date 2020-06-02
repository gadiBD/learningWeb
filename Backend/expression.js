import OPERATIONS from "../lib/operations.js";
import { ERROR_MESSAGES, isAnErrorMessage } from "../lib/errorMessages.js";
import Operand from "./operand.js";

export default class Expression {
  constructor() {
    this.clear();
  }

  clear = () => {
    this.operands = [];
    this.operators = [];
    this.finishedExpression = false;
  };

  static checkNegativeNumber = (text, index) => {
    return text[index] === "-" && (OPERATIONS[text[index - 1]] || index === 0);
  };

  static parseExpression = (text) => {
    const expression = new Expression();

    [...text].forEach((ch, index) => {
      if (!isNaN(ch) || ch === "." || Expression.checkNegativeNumber(text, index)) {
        expression.appendOperand(ch);
      } else if (OPERATIONS[ch]) {
        expression.appendOperation(ch);
      } else if (ch === "(") {
        expression.appendOperand(new Expression());
      } else if (ch === ")") {
        expression.closeExpression();
      }
    });
    return expression;
  };

  isLastOperandUnfinishedExpression = () => {
    return (
      this.operands.length > 0 &&
      this.operands[this.operands.length - 1] instanceof Expression &&
      !this.operands[this.operands.length - 1].finishedExpression
    );
  };

  isLastMemberAnOperator = () => {
    return this.operands.length === this.operators.length;
  };

  appendOperand = (operand) => {
    if (this.isLastMemberAnOperator()) {
      operand = operand instanceof Expression ? operand : new Operand(operand);
      this.operands.push(operand);
    } else {
      this.operands[this.operands.length - 1].appendOperand(operand);
    }
  };

  appendOperation = (operation) => {
    if (this.isLastOperandUnfinishedExpression()) {
      this.operands[this.operands.length - 1].appendOperation(operation);
    } else {
      this.operators.push(operation);
    }
  };

  closeExpression = () => {
    if (this.isLastOperandUnfinishedExpression()) {
      this.operands[this.operands.length - 1].closeExpression();
    } else {
      this.finishedExpression = true;
    }
  };

  findIndexOfNextOperator = (possibleOperations) => {
    return this.operators.findIndex((operator) => {
      return possibleOperations.includes(operator);
    });
  };

  computeCertainOperations = (possibleOperations) => {
    let index = this.findIndexOfNextOperator(possibleOperations);
    let error = false;
    let errorMessage;

    while (index != -1 && !error) {
      this.operands[index] = OPERATIONS[this.operators[index]](
        parseFloat(this.operands[index]),
        parseFloat(this.operands[index + 1])
      );

      if (isAnErrorMessage(this.operands[index])) {
        error = true;
        errorMessage = this.operands[index];
      }

      this.operands.splice(index + 1, 1);
      this.operators.splice(index, 1);
      index = this.findIndexOfNextOperator(possibleOperations);
    }

    return errorMessage;
  };

  compute = () => {
    let result = this.getResult();
    if (result.toString().includes("e+")) {
      result = ERROR_MESSAGES.NUMBER_TOO_BIG;
    } else if (result.toString().includes("e-")) {
      result = ERROR_MESSAGES.NUMBER_TOO_SMALL;
    }

    return isAnErrorMessage(result) ? result : Number(+result.toFixed(10));
  };

  getResult = () => {
    console.log("Start computing");
    console.log("Computing all inner Expression");
    let errorMessage;
    for (let index=0; index < this.operands.length; index++) {
      let operand = this.operands[index];
      if (operand instanceof Expression) {
        console.log(`Computing: ${operand}`);
        const result = operand.getResult();
        if (isAnErrorMessage(result)) {
          errorMessage = result;
          break;
        }
        this.operands[index] = new Operand(result.toString());
      }
    }

    if (!errorMessage) {
      errorMessage = this.computeCertainOperations(["*", "/"]);
      if (!errorMessage) {
        this.computeCertainOperations(["+", "-"]);
      }
    }

    console.log(`Result: ${this.operands[0]}`);
    return errorMessage ? errorMessage: this.operands[0];
  };

  toString = () => {
    let displayResult = "(";
    for (let i = 0; i < this.operators.length; i++) {
      displayResult += this.operands[i];
      displayResult += this.operators[i];
    }
    if (this.operands.length > this.operators.length) {
      displayResult += this.operands[this.operands.length - 1];
    }
    displayResult += ")";
    return displayResult;
  };
}
