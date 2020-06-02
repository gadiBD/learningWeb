import {ERROR_MESSAGES} from "../lib/errorMessages.js"

export default {
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
        return ERROR_MESSAGES.DIVISION_BY_ZERO;
      }
      return firstNum / secondNum;
    },
  };