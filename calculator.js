import Expression from "./expression.js";
import regexes from "./regexes.js";
import OPERATIONS from "./operations.js";

export default class Calculator {
  constructor(displayTextDiv) {
    this.displayTextDiv = displayTextDiv;
    this.unclosedBrackets = 0;
    this.clear();
  }

  clear = () => {
    this.displayText = "";
    this.unclosedBrackets = 0;
  };

  delete = () => {
    if (this.displayText === "NaN") {
      this.clear();
    } else {
      this.updateUnclosedBrackets();
      this.displayText = this.displayText.slice(0, -1);
    }
  };

  appendNumber = (number) => {
    if (this.isDisplayTextInvalid()) {
      this.clear();
    }
    if (regexes.canInsertNumber.test(this.displayText)) {
      this.displayText += number;
    }
  };

  appendPeriod = (period) => {
    if (this.isDisplayTextInvalid()) {
      this.clear();
    }
    if (!regexes.cannotInsertPeriod.test(this.displayText)) {
      this.appendNumber(period);
    }
  };

  isValid = () => {
    return regexes.isValid.test(this.displayText) && this.unclosedBrackets === 0;
  };

  chooseOperation = (operation) => {
    if (!this.isDisplayTextInvalid()) {
      if (regexes.canInsertOperation.test(this.displayText)) {
        if (regexes.canReplaceOperation.test(this.displayText)) {
          this.delete();
        }
        this.displayText += operation;
      }
    }
  };

  openParenthesis = () => {
    if (this.isDisplayTextInvalid()) {
      this.clear();
    }
    if (regexes.canOpenBracket.test(this.displayText)) {
      this.unclosedBrackets++;
      this.displayText += "(";
    }
  };

  closeParenthesis = () => {
    if (
      !this.isDisplayTextInvalid() &&
      this.unclosedBrackets !== 0 &&
      regexes.canCloseBracket.test(this.displayText)
    ) {
      this.unclosedBrackets--;
      this.displayText += ")";
    }
  };

  parseExpression = (text) => {
    const expression = new Expression();

    [...text].forEach((ch, index) => {
      if (!isNaN(ch) || ch === ".") {
        expression.appendOperand(ch);
      } else if (OPERATIONS[ch]) {
        expression.appendOperation(ch);
      } else if (ch === "(") {
        expression.appendOperand(new Expression());
      } else if (ch === ")") {
        expression.closeExpression();
      }
    });
    return expression;
  };

  compute = () => {
    if (this.isValid()) {
      const expression = this.parseExpression(this.displayText);
      this.displayText = expression.compute().toString();
    }
  };

  updateDisplay = () => {
    this.displayTextDiv.innerHTML = this.displayText;
  };

  updateUnclosedBrackets = () => {
    if (this.getLastChar() === "(") {
      this.unclosedBrackets--;
    } else if (this.getLastChar() === ")") {
      this.unclosedBrackets++;
    }
  };

  getLastChar = () => {
    return this.displayText.charAt(this.displayText.length - 1);
  };

  isDisplayTextInvalid = () => {
    return this.displayText === "NaN" || 
      this.displayText === "Number too big" || 
      this.displayText === "Number too small";
  };
}
