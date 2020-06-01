export default class Operand {
  constructor(number) {
    this.number = number;
  }

  appendOperand = (number) => {
    this.number = this.number.toString() + number.toString();

  };

  toString = () => {
    return this.number;
  };
}
