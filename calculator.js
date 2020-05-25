import Expression from "./expression.js"

export default class Calculator {
  constructor(displayTextDiv) {
      this.displayText = displayTextDiv;
      this.clear();
  }

  clear = () => {
    this.expression = new Expression();
  };

  appendNumber = (number) => {
    this.expression.appendNumber(number);
  };

  isValid = () => {
    this.expression.isValid();
  };

  chooseOperation = (operation) => {
    this.expression.chooseOperation(operation);
  };

  compute = () => {
    this.expression.compute();
  };

  delete = () => {
    this.expression.delete();
  };

  openParenthesis = () => {
    this.expression.openParenthesis();
  };

  closeParenthesis = () => {
    this.expression.closeParenthesis();
  };

  updateDisplay = () => {
    this.displayText.innerHTML = this.expression.toString();
  };
}