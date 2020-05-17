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

  clear = () => {
    this.operands = [];
    this.operators = [];
  }

  delete = () =>  {
    if (this.operands.length === this.operators.length) {
      this.operators.pop();
    } else {
      if (this.operands[this.operands.length - 1].length === 1) {
        this.operands.pop();
      } else {
        this.operands[this.operands.length - 1] = this.operands[
          this.operands.length - 1
        ]
          .toString()
          .slice(0, -1);
      }
    }
  }

  checkNaN = () => {
    if (this.operands.length === 1 && this.operands[0] != "." && isNaN(this.operands[0])) {
      this.operands = [];
    }
  }

  appendNumber = (number) => {
    this.checkNaN();

    if (this.operands.length === this.operators.length) {
      this.operands.push(number);
    } else {
      if (!(number === "." && this.operands[this.operands.length - 1].includes("."))) 
      {
        this.operands[this.operands.length - 1] =
          this.operands[this.operands.length - 1].toString() +
          number.toString();
      }
    }
  }

  chooseOperation = (operation) => {
    if (this.operands.length === this.operators.length) {
      this.operators[this.operators.length - 1] = operation;
    } else if (this.operands.length > this.operators.length) {
      this.operators.push(operation);
    }
  }

  compute = () => {
    if (this.operands.length > this.operators.length) {
      let result = this.operands[0];
      for (let i = 1; i < this.operands.length; i++) {
        result = operations[this.operators[i - 1]](
          parseFloat(result),
          parseFloat(this.operands[i])
        );
      }
      this.operands = [(Math.round((result + Number.EPSILON) * 100) / 100).toString()];
      this.operators = [];
    }
  }

  updateDisplay = () => {
    let displayResult = "";
    for (let i = 0; i < this.operators.length; i++) {
      displayResult += this.operands[i];
      displayResult += this.operators[i];
    }
    if (this.operands.length > this.operators.length) {
      displayResult += this.operands[this.operands.length - 1];
    }
    displayText.innerHTML = displayResult;
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
