const operations = {
  "+": (firstNum, secondNum) => {
    return firstNum + secondNum;
  },
  "-": (firstNum, secondNum) => {
    return firstNum - secondNum;
  },
  "*": (firstNum, secondNum) => {
    return firstNum * secondNum;
  },
  "/": (firstNum, secondNum) => {
    return firstNum / secondNum;
  },
};

const displayText = document.getElementById("displayText");

class Calculator {
  constructor() {
    this.clear();
  }

  clear() {
    this.firstNumber = "";
    this.secondNumber = "";
    this.operation = "";
  }

  appendNumber(number) {
    if (this.operation) {
      this.secondNumber = this.secondNumber.toString() + number.toString();
    } else {
      this.firstNumber = this.firstNumber.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (!this.secondNumber && this.firstNumber) {
      this.operation = operation;
    }
  }

  compute() {
    this.firstNumber = operations[this.operation](
      parseInt(this.firstNumber),
      parseInt(this.secondNumber)
    );
    this.secondNumber = "";
    this.operation = "";
  }

  updateDisplay() {
    displayText.innerHTML = `${this.firstNumber} ${this.operation} ${this.secondNumber}`;
  }
}

const numberButtons = document.querySelectorAll("[number]");
const operationButtons = document.querySelectorAll("[operation]");
const equalsButton = document.querySelector("[equals]");
const clearButton = document.querySelector("[clear]");

const calculator = new Calculator();

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.value);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.value);
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
