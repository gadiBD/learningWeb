export default class CalculatorBtn {
  constructor(attributes) {
    this.element = document.createElement("div");
    this.setCssClass();
    this.setId(attributes.id);
    this.setInnerHTML(attributes.value);
    this.setOnclick(attributes.method);
  }

  setCssClass = () => {
    this.element.setAttribute("class", "button");
  };

  setId = (id) => {
    if (id) {
      this.element.setAttribute("id", id);
    }
  };

  setInnerHTML = (value) => {
    this.element.innerHTML = value;
  };

  setOnclick = (method) => {
    this.element.addEventListener("click", () => {
      method(this.element.innerHTML);
    });
  };
}
