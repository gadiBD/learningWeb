import operations from "./operations.js";
import Operand from "./operand.js";
import regexes from "./regexes.js";

export default class Expression {
  constructor() {
    this.clear();
  }

  clear = () => {
    this.operands = [];
    this.operators = [];
    this.finishedExpression = false;
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
    // First compute all interior expressions and turn them into simple operands
    const MAX_NUMBER = 10 ** 18;
    this.operands.forEach((expression, index) => {
      if (expression instanceof Expression) {
        let result = expression.compute();
        this.operands[index] = new Operand(result.toString());
      }
    });
    this.computeCertainOperations(["*", "/"]);
    this.computeCertainOperations(["+", "-"]);
    if (this.operands[0].toString().includes("e+")) {
      return "Number too big";
    }
    else if (this.operands[0].toString().includes("e-")) {
      return "Number too small";
    }
    return this.operands[0];
  };

  isInRange = (number) => {
    return number > Number.MIN_SAFE_INTEGER && number < Number.MAX_SAFE_INTEGER;
  };

  round = (number, digits) => {
    let exponent = 10 ** digits;
    return Math.round((number + Number.EPSILON) * exponent) / exponent;
  };

  toString = () => {};
}
