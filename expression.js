import operations from "./operations.js";
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
      this.operands.push(operand instanceof Expression ? operand : new Operand(operand));
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
      this.operands[this.operands.length - 1].closeExpression()
    } else {
      this.finishedExpression = true;
    }
  }

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
    this.operands.forEach((expression, index) => {
      if (expression instanceof Expression) {
        expression.compute();
        this.operands[index] = new Operand(expression.operands[0].toString());
      }
    });
    this.computeCertainOperations(["*", "/"]);
    this.computeCertainOperations(["+", "-"]);
    return (
      Math.round((parseFloat(this.operands[0]) + Number.EPSILON) * 1000000) / 1000000
    );
    this.operands = [
      new Operand(
        (
          Math.round((parseFloat(this.operands[0]) + Number.EPSILON) * 1000000) / 1000000
        ).toString()
      ),
    ];
    this.operators = [];
  };

  toString = () => {};
}
