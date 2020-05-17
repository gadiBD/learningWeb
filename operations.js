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
        return NaN;
      }
      return firstNum / secondNum;
    },
  };