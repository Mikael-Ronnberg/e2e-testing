beforeEach(()=> {
  cy.visit("/");
});

describe("testing movieSite", () => {
  
  it("should input text", () => {
    cy.get("input").type("Star Wars").should("have.value", "Star Wars");
  });
  
  it("should be able to click", () => {
    cy.get("input").type("!");
    cy.get("button").click();
  });

  it("should show error", ()=>{
    cy.get("input").type("2");
    cy.get("button").click();
    cy.get("#movie-container").contains("Inga sökresultat");
  });
  
  // it("should search after input value", () => {
  //   cy.get("input").type("Star Wars").should("have.value", "Star Wars");
  //   cy.get("button").click();
  //   cy.get("#movie-container").contains("Star Wars");
  // });

  it("should get 10 search results", ()=>{
    cy.get("input").type("Star Wars");
    cy.get("button").click();
    cy.get("#movie-container > div").should("have.length", 10)
    cy.get("#movie-container").contains("Star Wars");
  });

  it("should call on API", ()=>{
    cy.intercept("GET", "http://omdbapi.com/?apikey=*",{Search: {}});
  });

  it("should request input value", () => {
    cy.intercept("GET", "http://omdbapi.com/?apikey=*", ({})).as("movieCall");
    cy.get("input").type("Star Wars");
    cy.get("button").click();
    cy.wait("@movieCall").its("request.url").should("contain", "s=Star%20Wars");
  });

})