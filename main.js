import Calculator from "./calculator.js";
import CalculatorBtn from "./calculatorButton.js";
import operations from "./operations.js";

const displayTextDiv = document.getElementById("displayText");
const calculator = new Calculator(displayTextDiv);

let pressNumber = (value) => {
  calculator.appendNumber(value);
  calculator.updateDisplay();
};

let pressOperator = (value) => {
  calculator.chooseOperation(value);
  calculator.updateDisplay();
};

let equals = () => {
  calculator.compute();
  calculator.updateDisplay();
};

let clear = () => {
  calculator.clear();
  calculator.updateDisplay();
};

let deleteChar = () => {
  calculator.delete();
  calculator.updateDisplay();
};

let openParenthesis = () => {
  calculator.openParenthesis();
  calculator.updateDisplay();
};

let closeParenthesis = () => {
  calculator.closeParenthesis();
  calculator.updateDisplay();
};

let elements = [
  { value: "C", method: clear },
  { value: "D", method: deleteChar },
  { value: "(", method: openParenthesis },
  { value: ")", method: closeParenthesis },
  { value: "1", method: pressNumber },
  { value: "2", method: pressNumber },
  { value: "3", method: pressNumber },
  { value: "+", method: pressOperator },
  { value: "4", method: pressNumber },
  { value: "5", method: pressNumber },
  { value: "6", method: pressNumber },
  { value: "-", method: pressOperator },
  { value: "7", method: pressNumber },
  { value: "8", method: pressNumber },
  { value: "9", method: pressNumber },
  { value: "*", method: pressOperator },
  { value: ".", method: pressNumber },
  { value: "0", method: pressNumber },
  { value: "=", id: "equals", method: equals },
  { value: "/", method: pressOperator },
];

let createButtons = (calculator) => {
  const calculatorDiv = document.getElementById("calculator");
  elements.forEach((element) => {
    calculatorDiv.appendChild(new CalculatorBtn(element).element);
  });
};

document.onkeyup = function (event) {
  // TODO: add period
  if (!isNaN(event.key)) {
    pressNumber(event.key);
  } else if (operations[event.key]) {
    pressOperator(event.key);
  } else if (event.key === "(") {
    openParenthesis();
  } else if (event.key === ")") {
    closeParenthesis();
  }
  else if (event.key === "r") {
    clear();
  }
  else if (event.key === "Enter") {
    equals();
  }
  else if (event.key === "Backspace") {
    deleteChar();
  }
};
createButtons();
