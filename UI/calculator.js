import Expression from "../Backend/expression.js";
import calcValidations from "../lib/calcValidation.js";
import {isAnErrorMessage} from "../lib/errorMessages.js"

export default class Calculator {
  constructor(displayTextDiv) {
    this.displayTextDiv = displayTextDiv;
    this.unclosedBrackets = 0;
    this.clear();
  }

  clear = () => {
    console.log("Clearing calculator")
    this.displayText = "";
    this.unclosedBrackets = 0;
  };

  delete = () => {
    console.log("Pressed on Delete")
    if (this.displayText === "NaN") {
      this.clear();
    } else {
      console.log("Deleteing part of result")
      this.updateUnclosedBrackets();
      this.displayText = this.displayText.slice(0, -1);
    }
  };

  appendNumber = (number) => {
    console.log("Pressed on a Number")
    if (this.isDisplayTextInvalid()) {
      this.clear();
    }
    if (calcValidations.canInsertNumber(this.displayText)) {
      console.log("Appended number/period")
      this.displayText += number;
    }
  };

  appendPeriod = (period) => {
    console.log("Pressed on a period")
    if (this.isDisplayTextInvalid()) {
      this.clear();
    }
    if (calcValidations.canInsertPeriod(this.displayText)) {
      this.appendNumber(period);
    }
  };

  isValid = () => {
    return calcValidations.isValid(this.displayText) && this.unclosedBrackets === 0;
  };

  chooseOperation = (operation) => {
    console.log("Pressed on a operator")
           
    if (!this.isDisplayTextInvalid()) {
      if (calcValidations.canInsertOperation(this.displayText)) {
        if (calcValidations.canReplaceOperation(this.displayText)) {
          console.log("Deleting operator")
          this.delete();
        }
        console.log("Adding operator")
        this.displayText += operation;
      }
    }
  };

  openParenthesis = () => {
    console.log("Pressed on Open Parenthesis")
    if (this.isDisplayTextInvalid()) {
      this.clear();
    }
    if (calcValidations.canOpenBracket(this.displayText)) {
      console.log("Added open Parenthesis")
      this.unclosedBrackets++;
      this.displayText += "(";
    }
  };

  closeParenthesis = () => {
    console.log("Pressed on close Parenthesis")
    if (
      !this.isDisplayTextInvalid() &&
      this.unclosedBrackets !== 0 &&
      calcValidations.canCloseBracket(this.displayText)
    ) {
      console.log("Added close Parenthesis")
      this.unclosedBrackets--;
      this.displayText += ")";
    }
  };

  compute = () => {
    if (this.isValid()) {
      console.log(`Computing and starting to parse: ${this.displayText}`)
      const expression = Expression.parseExpression(this.displayText);
      console.log(`Parsed to: ${expression}`)
      this.displayText = expression.compute().toString();
    }
  };

  updateDisplay = () => {
    console.log("Updating display")
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
    return isAnErrorMessage(this.displayText);
  };
}
