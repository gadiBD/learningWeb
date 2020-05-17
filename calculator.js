import Expression from "./expression.js";

const displayText = document.getElementById("displayText");

class Calculator {
  constructor() {
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

const numberButtons = document.querySelectorAll("[number]");
const operationButtons = document.querySelectorAll("[operation]");
const equalsButton = document.querySelector("[equals]");
const clearButton = document.getElementById("clear");
const deleteButton = document.getElementById("delete");
const openParenthesisButton = document.getElementById("openParenthesis");
const closeParenthesisButton = document.getElementById("closeParenthesis");

const calculator = new Calculator();

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerHTML);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerHTML);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

clearButton.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
});

openParenthesisButton.addEventListener("click", (button) => {
  calculator.openParenthesis();
  calculator.updateDisplay();
});

closeParenthesisButton.addEventListener("click", (button) => {
  calculator.closeParenthesis();
  calculator.updateDisplay();
});
