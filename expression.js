import operations from "./operations.js";
import Operand from "./operand.js";

export default class Expression {
  constructor() {
    this.clear();
  }

  clear = () => {
    this.operands = [];
    this.operators = [];
    this.startParenthesis = false;
    this.endParenthesis = false;
  };

  delete = () => {
    // Checks if last operand is an expression
    if (
      this.operands.length > this.operators.length &&
      this.operands[this.operands.length - 1] instanceof Expression
    ) {
      // When number of operands is 0, delete starting parenthesis and the Expression itself
      if (this.operands[this.operands.length - 1].operands.length === 0) {
        this.operands[this.operands.length - 1].startParenthesis = false;
        this.operands.pop();
      }
      // Delete ending parenthesis
      else if (this.operands[this.operands.length - 1].endParenthesis) {
        this.operands[this.operands.length - 1].endParenthesis = false;
      } else {
        this.operands[this.operands.length - 1].delete();
      }
    }
    // Delete an operator
    else if (this.operands.length === this.operators.length) {
      this.operators.pop();
    } else {
      // Delete operand
      if (this.operands[this.operands.length - 1].number.length === 1) {
        this.operands.pop();
      }
      // Delete part of operand
      else {
        this.operands[this.operands.length - 1].delete();
      }
    }
  };

  appendNumber = (number) => {
    // Checks if last operand is an expression
    if (
      this.operands.length > this.operators.length &&
      this.operands[this.operands.length - 1] instanceof Expression
    ) {
      this.operands[this.operands.length - 1].appendNumber(number);
    }
    // Add new operand
    else if (this.operands.length === this.operators.length) {
      this.operands.push(new Operand(number));
    }
    // Add to exisiting operand
    else {
      this.operands[this.operands.length - 1].appendNumber(number);
    }
  };

  isValid = () => {
    let isValid = true;
    // Checks if all interior expressions are valid
    this.operands.forEach((expression, index) => {
      if (expression instanceof Expression) {
        isValid = isValid && expression.isValid();
        isValid = isValid && expression.startParenthesis && expression.endParenthesis;
      }
    });
    // Check if correct number of operands and operators
    return isValid && this.operands.length > this.operators.length;
  };

  computeCertainOperations = (possibleOperations) => {
    let index = this.operators.findIndex((operator) =>
      possibleOperations.includes(operator)
    );

    // While possible operation was found
    while (index != -1) {
      this.operands[index] = operations[this.operators[index]](
        parseFloat(this.operands[index]),
        parseFloat(this.operands[index + 1])
      );

      // Deletes the operand and operator
      this.operands.splice(index + 1, 1);
      this.operators.splice(index, 1);
      index = this.operators.findIndex((operator) =>
        possibleOperations.includes(operator)
      );
    }
  };

  compute = () => {
    if (this.isValid()) {
      // First compute all interior expressions and turn them into simple operands
      this.operands.forEach((expression, index) => {
        if (expression instanceof Expression) {
          expression.compute();
          this.operands[index] = new Operand(expression.operands[0].toString());
        }
      });
      this.computeCertainOperations(["*", "/"]);
      this.computeCertainOperations(["+", "-"]);
      this.operands = [
        new Operand(
          (
            Math.round((parseFloat(this.operands[0]) + Number.EPSILON) * 100) / 100
          ).toString()
        ),
      ];
      this.operators = [];
    }
  };

  chooseOperation = (operation) => {
    // Checks if last operand is an Expression that is not closed
    if (
      this.operands.length > this.operators.length &&
      this.operands[this.operands.length - 1] instanceof Expression &&
      !this.operands[this.operands.length - 1].endParenthesis
    ) {
      this.operands[this.operands.length - 1].chooseOperation(operation);
    }
    // Can only choose operation if there is a valid first operand
    else if (!(this.operands.length > 0 && isNaN(this.operands[0]))) {
      // In order to switch current last operation
      if (this.operands.length === this.operators.length) {
        this.operators[this.operators.length - 1] = operation;
      }
      // Add new operation
      else if (this.operands.length > this.operators.length) {
        this.operators.push(operation);
      }
    }
  };

  openParenthesis = () => {
    // Checks if last operand is Expression
    if (
      this.operands.length > this.operators.length &&
      this.operands[this.operands.length - 1] instanceof Expression
    ) {
      this.operands[this.operands.length - 1].openParenthesis();
    } else if (this.operands.length === this.operators.length) {
      let expression = new Expression();
      expression.startParenthesis = true;
      this.operands.push(expression);
    }
  };

  closeParenthesis = () => {
    // Check if last operand is an unfinished expression
    if (
      this.operands.length > this.operators.length &&
      this.operands[this.operands.length - 1] instanceof Expression &&
      !this.operands[this.operands.length - 1].endParenthesis
    ) {
      this.operands[this.operands.length - 1].closeParenthesis();
    } else if (this.operands.length > this.operators.length && this.startParenthesis) {
      this.endParenthesis = true;
    }
  };

  toString = () => {
    let displayResult = this.startParenthesis ? "(" : "";
    for (let i = 0; i < this.operators.length; i++) {
      displayResult += this.operands[i];
      displayResult += this.operators[i];
    }
    if (this.operands.length > this.operators.length) {
      displayResult += this.operands[this.operands.length - 1];
    }
    displayResult += this.endParenthesis ? ")" : "";
    return displayResult;
  };
}
