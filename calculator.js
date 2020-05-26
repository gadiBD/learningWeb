import Expression from "./expression.js";
import regexes from "./regexes.js";
import operations from "./operations.js";

export default class Calculator {
  constructor(displayTextDiv) {
    this.displayTextDiv = displayTextDiv;
    this.unclosedBrackets = 0;
    this.clear();
  }

  clear = () => {
    this.displayText = "";
  };

  getLastChar = () => {
    return this.displayText.charAt(this.displayText.length - 1);
  };

  appendNumber = (number) => {
    if (regexes.canInsertNumber.test(this.displayText)) {
      this.displayText += number;
    }
  };

  appendPeriod = (number) => {
    // if (this.getLastChar() != ")") {
    this.displayText += number;
    // }
  };

  isValid = () => {
    return true;
    // this.expression.isValid();
  };

  chooseOperation = (operation) => {
    this.displayText += operation;
  };

  parseExpression = (text) => {
    let expression = new Expression();

    [...text].forEach((ch, index) => {
      if (!isNaN(ch) || ch === ".") {
        expression.appendOperand(ch);
      } else if (operations[ch]) {
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
      let expression = this.parseExpression(this.displayText);
      this.displayText = expression.compute().toString();
    }
  };

  delete = () => {
    this.displayText = this.displayText.slice(0, -1);
  };

  openParenthesis = () => {
    if (regexes.canOpenBracket.test(this.displayText)) {
      this.unclosedBrackets++;
      this.displayText += "(";
    }
  };

  closeParenthesis = () => {
    if (regexes.canCloseBracket.test(this.displayText)) {
      if (this.unclosedBrackets !== 0) {
        this.unclosedBrackets--;
        this.displayText += ")";
      }
    }
  };

  updateDisplay = () => {
    this.displayTextDiv.innerHTML = this.displayText;
  };
}
