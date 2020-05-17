export default class Operand {
  constructor(number) {
    this.number = number;
  }

  delete = () => {
    this.number = this.number.toString().slice(0, -1);
  };

  appendNumber = (number) => {
    if (isNaN(this.number)) {
      this.number = number;
    } else if (!(number === "." && this.number.includes("."))) {
      this.number = this.number.toString() + number.toString();
    }
  };

  isValid = () => {
    return !isNaN(this.number);
  };

  toString = () => {
    return this.number.toString();
  };
}
