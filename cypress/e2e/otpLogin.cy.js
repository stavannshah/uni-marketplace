describe("OTP Login Flow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173"); 
    // Intercept API calls to mock responses
    cy.intercept('POST', 'http://localhost:8080/api/saveUser', {
      statusCode: 200,
      body: { message: 'User saved successfully' }
    }).as('saveUser');
  });

  it("validates email format requiring @ufl.edu domain", () => {
    // Get the email input by its type and attribute
    cy.get('input[type="text"]').first().type("invalid@gmail.com");
    cy.contains("Send OTP").click();
    // Check for error message
    cy.contains("Please enter a valid @ufl.edu email address.").should("be.visible");
  });

  // it("sends OTP for valid email format", () => {
  //   // Intercept emailjs send call
  //   cy.window().then((win) => {
  //     cy.stub(win.emailjs, 'send').resolves({});
  //   });
    
  //   // Enter valid email
  //   cy.get('input[type="text"]').first().type("test@ufl.edu");
  //   cy.contains("Send OTP").click();
    
  //   // Use spy to verify alert was shown
  //   cy.on("window:alert", (text) => {
  //     expect(text).to.equal("OTP sent to your email!");
  //   });
    
  //   // Verify we moved to the OTP verification step
  //   cy.contains("Verify OTP").should("be.visible");
  // });
  
  // it("completes login flow with correct OTP", () => {
  //   // Mock the OTP generation to use a fixed value for testing
  //   cy.window().then((win) => {
  //     cy.stub(Math, 'random').returns(0.123456);
  //     cy.stub(win.emailjs, 'send').resolves({});
  //   });
    
  //   // Complete email step
  //   cy.get('input[type="text"]').first().type("test@ufl.edu");
  //   cy.contains("Send OTP").click();
    
  //   // Enter the OTP (123456 based on our mock)
  //   cy.get('input[type="text"]').eq(1).type("123456");
  //   cy.contains("Verify and Login").click();
    
  //   // Verify redirect or successful login state
  //   cy.contains("Home").should("be.visible");
  // });
});