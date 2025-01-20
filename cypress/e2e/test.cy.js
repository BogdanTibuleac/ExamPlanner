describe("USV Timetable for Professor", () => {
    it("should load the professor's timetable and validate data", () => {
      // Visit the professor's timetable page
      cy.visit("https://orar.usv.ro/profesori/110");
  
      // Assert the page URL is correct
      cy.url().should("include", "/profesori/110");
  
      // Intercept and validate API requests
      cy.intercept("GET", "/orar/vizualizare/data/orarSPG.php?mod=prof&ID=110&json").as("profTimetable");
      cy.intercept("GET", "/orar/vizualizare/data/cadre.php?json").as("professorsData");
      cy.intercept("GET", "/orar/vizualizare/data/sali.php?json").as("roomsData");
  
      // Wait for the API responses and ensure they return a 200 status code
      cy.wait("@profTimetable").its("response.statusCode").should("eq", 200);
      cy.wait("@professorsData").its("response.statusCode").should("eq", 200);
      cy.wait("@roomsData").its("response.statusCode").should("eq", 200);
  

    });
  });
  