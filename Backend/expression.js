import OPERATIONS from "../lib/operations.js";
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
    return text[index] === "-" && (OPERATIONS[text[index-1]] || index===0)
  }

  static parseExpression = (text) => {
    const expression = new Expression();

    [...text].forEach((ch, index) => {
      if (!isNaN(ch) || ch === "." || Expression.checkNegativeNumber(text,index)) {
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

  computeCertainOperations = (possibleOperations) => {
    let index = this.operators.findIndex((operator) =>
      possibleOperations.includes(operator)
    );

    while (index != -1) {
      this.operands[index] = OPERATIONS[this.operators[index]](
        parseFloat(this.operands[index]),
        parseFloat(this.operands[index + 1])
      );

      this.operands.splice(index + 1, 1);
      this.operators.splice(index, 1);
      index = this.operators.findIndex((operator) =>
        possibleOperations.includes(operator)
      );
    }
  };

  compute = () => {
    console.log("Start computing")
    console.log("Computing all inner Expression")
    this.operands.forEach((expression, index) => {
      if (expression instanceof Expression) {
        console.log(`Computing: ${expression}`)
        const result = expression.compute();
        this.operands[index] = new Operand(result.toString());
      }
    });
    this.computeCertainOperations(["*", "/"]);
    this.computeCertainOperations(["+", "-"]);
    if (this.operands[0].toString().includes("e+")) {
      return "Number too big";
    } else if (this.operands[0].toString().includes("e-")) {
      return "Number too small";
    }
    console.log(`Result: ${this.operands[0]}`)
    return Number((+this.operands[0]).toFixed(10));
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
