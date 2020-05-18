describe("Tests my calculator", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/index.html");
  });
 
  it("Check Simple Operation", () => {
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("+").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "23");
  });

  it("Check that the order of operation works", () => {
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("+").click();
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains("/").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains("+").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains("*").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "11");
  });

  it("Check that the rounding works", () => {
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("/").click();
    cy.get(".button").contains("3").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "0.33");
  });

   it("Check division by zero", () => {
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("/").click();
    cy.get(".button").contains("0").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "NaN");
  });

  it("Check parenthesis", () => {
    cy.get(".button").contains("(").click();
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("+").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains(")").click();
    cy.get(".button").contains("*").click();
    cy.get(".button").contains("3").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "9");
  });

  it("Check the Clear button", () => {
    cy.get(".button").contains("(").click();
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("+").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains(")").click();
    cy.get(".button").contains("*").click();
    cy.get(".button").contains("3").click();
    cy.get(".button").contains("C").click();
    cy.get("#displayText").should("be.empty");
  });

  it("Check the Delete button", () => {
    cy.get(".button").contains("(").click();
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("+").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains(")").click();
    cy.get(".button").contains("*").click();
    cy.get(".button").contains("3").click();
    cy.get(".button").contains("D").click();
    cy.get("#displayText").should("have.text", "(1+2)*");
    cy.get(".button").contains("D").click();
    cy.get("#displayText").should("have.text", "(1+2)");
    cy.get(".button").contains("D").click();
    cy.get("#displayText").should("have.text", "(1+2");
    cy.get(".button").contains("D").click();
    cy.get("#displayText").should("have.text", "(1+");
    cy.get(".button").contains("D").click();
    cy.get("#displayText").should("have.text", "(1");
    cy.get(".button").contains("D").click();
    cy.get("#displayText").should("have.text", "(");
    cy.get(".button").contains("D").click();
    cy.get("#displayText").should("be.empty");
  });

  it("Check the decimal point", () => {
    cy.get(".button").contains("(").click();
    cy.get(".button").contains("1").click();
    cy.get(".button").contains(".").click();
    cy.get(".button").contains("5").click();
    cy.get(".button").contains("+").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains(")").click();
    cy.get(".button").contains("*").click();
    cy.get(".button").contains("3").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "10.5");
  });

  it("Check the parenthesis in parenthesis", () => {
    cy.get(".button").contains("(").click();
    cy.get(".button").contains("(").click();
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("+").click();
    cy.get(".button").contains("2").click();
    cy.get(".button").contains(")").click();
    cy.get(".button").contains("*").click();
    cy.get(".button").contains("3").click();
    cy.get(".button").contains(")").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "9");
  });

  it("Check the equals button is disabled when needed", () => {
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "1");
    cy.get(".button").contains("+").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "1+");
    cy.get(".button").contains("(").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "1+(");
    cy.get(".button").contains("(").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "1+((");
    cy.get(".button").contains("1").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "1+((1");
    cy.get(".button").contains("+").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "1+((1+");
    cy.get(".button").contains("2").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "1+((1+2");
    cy.get(".button").contains(")").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "1+((1+2)");
    cy.get(".button").contains("*").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "1+((1+2)*");
    cy.get(".button").contains("3").click();
    cy.get(".button").contains("=").click();
    cy.get("#displayText").should("have.text", "1+((1+2)*3");
  });

});
