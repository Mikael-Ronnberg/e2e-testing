const mockData = {
  Search : [
    {
        "Title": "Movie Wars",
        "ImdbID": "898978",
        "Type": "test",
        "Poster": "Urlol",
        "Year": "2152"
    },
    {
        "Title": "War of Movies",
        "ImdbID": "898978",
        "Type": "test",
        "Poster": "Urlol",
        "Year": "2222"
    },
    {
        "Title": "Cinema Wars",
        "ImdbID": "898978",
        "Type": "test",
        "Poster": "Urlol",
        "Year": "2202"
    }
]
};

const failedMock = {
  TrySearch : [
    {
      "Movie" : "Wars Movie",
      "ID": "3124",
      "Test": "Test",
      "IMG" : "URLol",
      "Date": "2321"
    }
  ]
}


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

  it("should use mockData", ()=>{

    cy.intercept("GET", "http://omdbapi.com/?apikey=*", (mockData)).as("mockCall");

    cy.get("input").type("ggggg")
    cy.get("button").click();
    cy.wait("@mockCall");

    cy.get("#movie-container").contains("Movie Wars");

  });

  it("should get error?", ()=>{

    cy.intercept("GET", "http://omdbapi.com/?apikey=*", (failedMock)).as("mockCall");

    cy.get("input").type("ggggg")
    cy.get("button").click();
    cy.wait("@mockCall");

    cy.get("#movie-container").contains("Inga sökresultat");

  });



})