describe("Lesson Form", () => {
    beforeEach(() => {
      // Visit the page where the form is located
      // Replace with your actual route URL
      cy.visit("/path-to-your-form-page");
    });
  
    it("should display the form correctly", () => {
      // Verify that the form title exists
      cy.get("h1").should("be.visible").and("contain", "Create a new lesson");
  
      // Check if all the form fields are visible
      cy.get('input[name="name"]').should("be.visible");
      cy.get('select[name="subjectId"]').should("be.visible");
      cy.get('select[name="day"]').should("be.visible");
      cy.get('input[name="startTime"]').should("be.visible");
      cy.get('input[name="endTime"]').should("be.visible");
      cy.get('select[name="classId"]').should("be.visible");
      cy.get('select[name="teacherId"]').should("be.visible");
    });
  
    it("should fill in the form and submit it", () => {
      // Type into the form fields
      cy.get('input[name="name"]').type("Math Lesson");
      cy.get('select[name="subjectId"]').select("1"); // Assuming 1 is a valid subjectId
      cy.get('select[name="day"]').select("MONDAY");
      cy.get('input[name="startTime"]').type("2025-01-01T09:00");
      cy.get('input[name="endTime"]').type("2025-01-01T10:00");
      cy.get('select[name="classId"]').select("2"); // Assuming 2 is a valid classId
      cy.get('select[name="teacherId"]').select("3"); // Assuming 3 is a valid teacherId
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Assert that the form submission was successful
      // Here we assume a success toast or page redirect
      cy.contains("Created successfully!").should("be.visible");
    });
  
    it("should show validation errors for empty fields", () => {
      // Try submitting without filling in the fields
      cy.get('button[type="submit"]').click();
  
      // Check for error messages
      cy.get('input[name="name"] + p').should("contain", "This field is required");
      cy.get('select[name="subjectId"] + p').should("contain", "This field is required");
      cy.get('select[name="day"] + p').should("contain", "This field is required");
      cy.get('input[name="startTime"] + p').should("contain", "This field is required");
      cy.get('input[name="endTime"] + p').should("contain", "This field is required");
      cy.get('select[name="classId"] + p').should("contain", "This field is required");
      cy.get('select[name="teacherId"] + p').should("contain", "This field is required");
    });
  
    it("should show an error message if the API call fails", () => {
      // Simulate a failing API call (You can stub the API response to return an error)
      cy.intercept('POST', '/api/lessons', {
        statusCode: 500,
        body: { message: "Something went wrong!" },
      }).as("postLesson");
  
      // Fill in the form
      cy.get('input[name="name"]').type("Math Lesson");
      cy.get('select[name="subjectId"]').select("1");
      cy.get('select[name="day"]').select("MONDAY");
      cy.get('input[name="startTime"]').type("2025-01-01T09:00");
      cy.get('input[name="endTime"]').type("2025-01-01T10:00");
      cy.get('select[name="classId"]').select("2");
      cy.get('select[name="teacherId"]').select("3");
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Verify that the error message is displayed
      cy.contains("Something went wrong!").should("be.visible");
    });
  });
  