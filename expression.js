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

  isLastOperandExpression = () => {
    return (
      this.operands.length > 0 &&
      this.operands[this.operands.length - 1] instanceof Expression
    );
  };

  isLastOperandExpressionUnfinished = () => {
    return !this.operands[this.operands.length - 1].endParenthesis;
  };

  isLastMemberAnOperator = () => {
    return this.operands.length === this.operators.length;
  };

  isValid = () => {
    // Check if correct number of operands and operators
    let isValid = this.operands.length > this.operators.length;

    // Checks if all interior expressions are valid
    this.operands.forEach((expression, index) => {
      if (expression instanceof Expression) {
        isValid = isValid && expression.isValid();
        isValid = isValid && expression.startParenthesis && expression.endParenthesis;
      }
    });

    return isValid;
  };

  appendNumber = (number) => {
    // Add new operand
    if (this.isLastMemberAnOperator()) {
      this.operands.push(new Operand(number));
    } else {
      this.operands[this.operands.length - 1].appendNumber(number);
    }
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
            Math.round((parseFloat(this.operands[0]) + Number.EPSILON) * 1000000) /
            1000000
          ).toString()
        ),
      ];
      this.operators = [];
    }
  };

  chooseOperation = (operation) => {
    if (this.isLastOperandExpression() && this.isLastOperandExpressionUnfinished()) {
      this.operands[this.operands.length - 1].chooseOperation(operation);
    }
    // Can only choose operation if there is a valid first operand
    else if (
      this.operands.length > 0 &&
      (!isNaN(this.operands[0]) || this.operands[0] instanceof Expression)
    ) {
      if (this.isLastOperandExpression()) {
        this.operators[this.operators.length - 1] = operation;
      } else if (this.operands.length > this.operators.length) {
        this.operators.push(operation);
      }
    }
  };

  openParenthesis = () => {
    if (this.isLastOperandExpression()) {
      this.operands[this.operands.length - 1].openParenthesis();
    } else if (this.isLastOperandExpression()) {
      let expression = new Expression();
      expression.startParenthesis = true;
      this.operands.push(expression);
    }
  };

  closeParenthesis = () => {
    if (this.isLastOperandExpression() && this.isLastOperandExpressionUnfinished()) {
      this.operands[this.operands.length - 1].closeParenthesis();
    } else if (this.operands.length > this.operators.length && this.startParenthesis) {
      this.endParenthesis = true;
    }
  };

  delete = () => {
    if (this.isLastOperandExpression()) {
      // Delete all of last expression
      if (this.operands[this.operands.length - 1].operands.length === 0) {
        this.operands.pop();
      } 
      else if (this.operands[this.operands.length - 1].endParenthesis) {
        this.operands[this.operands.length - 1].endParenthesis = false;
      } else {
        this.operands[this.operands.length - 1].delete();
      }
    } else if (this.isLastMemberAnOperator()) {
      this.operators.pop();
    } else {
      this.operands[this.operands.length - 1].delete();
      if (this.operands[this.operands.length - 1].number.length === 0) {
        this.operands.pop();
      }
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
