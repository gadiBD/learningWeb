import Calculator from "./calculator.js";
import elements from "./htmlSetup.js";

const calculator = new Calculator();

function pressNumber(value) {
  calculator.appendNumber(value);
  calculator.updateDisplay();
}

function pressOperator(value) {
  calculator.chooseOperation(value);
  calculator.updateDisplay();
}

function equals() {
  calculator.compute();
  calculator.updateDisplay();
}

let tomabni = () => {
  calculator.clear();
  calculator.updateDisplay();
}

function deleteChar() {
  calculator.delete();
  calculator.updateDisplay();
}

function openParenthesis() {
  calculator.openParenthesis();
  calculator.updateDisplay();
}

function closeParenthesis() {
  calculator.closeParenthesis();
  calculator.updateDisplay();
}


const types = {
  'number': (value) => pressNumber(value),
  'operator': (operator) => pressOperator(operator),
  'equals': () => equals()
};

function createButton(attributes) {
  let element = document.createElement("div");
  element.setAttribute('class', 'button');
  element.setAttribute('id', attributes.id);
  element.innerHTML = attributes.value;
  element.addEventListener("click", () => {
    types[attributes.type](attributes.value)
  });
  return element;
}

const calculatorDiv = document.getElementById("calculator");
elements.forEach((element) => {
  calculatorDiv.appendChild(createButton(element));
})