describe("Exam Joining - Dragos Ibanescu", () => {
    it("should login, navigate to exams, and join an exam", () => {
      // Visit the login page
      cy.visit("http://localhost:3000");
  
      // Enter valid username and password
      cy.get('input[name="identifier"]').type('dragos_ibanescu'); // Replace with valid username
      cy.get('input[name="password"]').type('dragos_ibanescu123'); // Replace with valid password
  
      // Click the sign-in button
      cy.get('button[type="submit"]').click();
  
      // Wait for the page to redirect after successful login
      cy.url({ timeout: 10000 }).should('include', '/dashboard/student'); // Ensure student is logged in
  
      // Navigate to the exams page
      cy.visit("http://localhost:3000/dashboard/list/exams");
  
      // Ensure we are on the exams page
      cy.url().should('include', '/dashboard/list/exams');
  
      // Find and click the "Join Exam" button
      cy.get('button.bg-lamaYellow').eq(5).should('be.visible').click(); // Adjust index as needed
  
      // Wait for the join action to complete, check for "Great" message
      cy.contains('Great').should('be.visible'); // Verify the message after joining the exam
  
      // Optionally, assert that the exam is listed in the student’s exam list
      // cy.get('table').contains('Math Exam').should('be.visible'); // Adjust based on your exam listing
    });
  });
  