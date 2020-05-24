import Expression from "./expression.js"

export default class Calculator {
  constructor() {
    this.displayText = document.getElementById("displayText");
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
    displayText.innerHTML = this.expression.toString();
  };
}