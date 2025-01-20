describe("Exam Creation", () => {
  it("should login, navigate to exams, and create an exam", () => {
    // Visit the login page
    cy.visit("http://localhost:3000");

    // Enter valid username and password
    cy.get('input[name="identifier"]').type('admin'); // Replace with valid username
    cy.get('input[name="password"]').type('admin'); // Replace with valid password

    // Click the sign-in button
    cy.get('button[type="submit"]').click();

    // Wait for the page to redirect after successful login
    cy.url({ timeout: 10000 }).should('include', '/dashboard/admin'); // Adjust the role if necessary

    // Navigate to the exams page
    cy.visit("http://localhost:3000/dashboard/list/exams");

    // Ensure we are on the exams page
    cy.url().should('include', '/dashboard/list/exams');

    // Ensure the "Create Exam" button is visible and clickable
    cy.get('button.bg-lamaYellow').eq(2).should('be.visible').click(); // Use .first() to ensure a single click

    // Wait for the form to appear
    cy.get('form').should('be.visible');

    // Fill out the exam form
    cy.get('input[name="title"]').type('Math Exam'); // Enter exam title
    cy.get('input[name="startTime"]').type('2025-02-01T02:00'); // Set start time
    cy.get('input[name="endTime"]').type('2025-02-01T03:00'); // Set end time
    cy.get('select[name="lessonId"]').select('1'); // Choose a course
    cy.get('select[name="roomId"]').select('1'); // Choose a room

    // Submit the form to create the exam
    //cy.get('button[type="submit"]').click();
    cy.get('button').contains('Create').click();

    // Assert that the exam creation was successful
    cy.contains('Created successfully!').should('be.visible'); // Adjust this message if necessary
   
  });
});
