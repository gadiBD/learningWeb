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
    if (secondNum === 0) {
      return NaN;
    }
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

  delete() {
    if (this.secondNumber) {
      this.secondNumber = this.secondNumber.toString().slice(0, -1);
    } else if (this.operation) {
      this.operation = "";
    } else {
      this.firstNumber = this.firstNumber.toString().slice(0, -1);
    }
  }

  appendNumber(number) {
      
    if (isNaN(this.firstNumber)) {
      this.clear();
    }

    if (this.operation) {
      if (!(number === "." && this.secondNumber.includes("."))) {
        this.secondNumber = this.secondNumber.toString() + number.toString();
      }
    } else {
      if (!(number === "." && this.firstNumber.includes("."))) {
        this.firstNumber = this.firstNumber.toString() + number.toString();
      }
    }
  }

  chooseOperation(operation) {
    if (!this.secondNumber && this.firstNumber) {
      this.operation = operation;
    }
  }

  compute() {
    if (this.secondNumber) {
      this.firstNumber = operations[this.operation](
        parseFloat(this.firstNumber),
        parseFloat(this.secondNumber)
      ).toString();
      this.secondNumber = "";
      this.operation = "";
    }
  }

  updateDisplay() {
    displayText.innerHTML = `${this.firstNumber} ${this.operation} ${this.secondNumber}`;
  }
}

const numberButtons = document.querySelectorAll("[number]");
const operationButtons = document.querySelectorAll("[operation]");
const equalsButton = document.querySelector("[equals]");
const clearButton = document.getElementById("clear");
const deleteButton = document.getElementById("delete");

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
