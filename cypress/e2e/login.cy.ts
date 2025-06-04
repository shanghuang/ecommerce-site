// cypress/e2e/login.cy.ts
describe('Login Page', () => {

  const validCredentials = {
    name: 'John Doe',
    email: 'newuser@example.com',
    password: 'Password123!',
  };

  const invalidCredentials = {
    name: '',
    email: 'invalid-email',
    password: 'short',
  };

  it('successfully registers a new user', () => {
    // Navigate to register page
    cy.visit('/register');

    // Fill form with valid data
    cy.get('input[id="name"]').type(validCredentials.name);
    cy.get('input[id="email"]').type(validCredentials.email);
    cy.get('input[id="password"]').type(validCredentials.password);

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for redirect to home page
    cy.url().should('eq', 'http://localhost:3000/login');

    // Optional: Verify a success message or user data
    //cy.contains('h1', 'Welcome, John Doe').should('be.visible');
  });

  /*it('shows validation errors for invalid data', () => {
    // Navigate to register page
    cy.visit('/register');

    // Fill form with invalid data
    cy.get('input[id="name"]').type(invalidCredentials.name);
    cy.get('input[id="email"]').type(invalidCredentials.email);
    cy.get('input[id="password"]').type(invalidCredentials.password);

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for error messages to appear
    cy.get('p.text-red-500').should('have.length.at.least', 3);

    // Verify specific error messages
    cy.contains('p.text-red-500', 'Name is required');
    cy.contains('p.text-red-500', 'Email is invalid');
    cy.contains('p.text-red-500', 'Password must be at least 6 characters');

    // Verify no redirect occurred
    cy.url().should('eq', 'http://localhost:3000/register');
  });*/


  //login fail
  it('shows error for invalid credentials', () => {
    cy.visit('/login');

    cy.get('input[id="email"]').type('invalid@example.com');
    cy.get('input[id="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.get('div.bg-red-100').should('contain', 'Invalid credentials');
    cy.url().should('eq', 'http://localhost:3000/login');
  });

  it('successfully logs in', () => {
    cy.visit('/login');

    cy.get('input[id="email"]').type(validCredentials.email);
    cy.get('input[id="password"]').type(validCredentials.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:3000/');

    cy.backupLocalStorage("token");
    cy.backupLocalStorage("email");
    cy.backupLocalStorage("userId");
    //cy.get('div').contains('Welcome back!').should('be.visible');
  });

  it('successfully unregisters a user', () => {
    /*cy.intercept('DELETE', '/api/unregister', {
      statusCode: 200,
      body: {},
    }).as('unregisterRequest');*/

    cy.restoreLocalStorage("token");
    cy.restoreLocalStorage("email");
    cy.restoreLocalStorage("userId");

    cy.visit('/unregister');
    cy.get('input#password').type(validCredentials.password);
    cy.get('button[type="submit"]').click();

    /*cy.wait('@unregisterRequest').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
    });*/

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    /*cy.window().then(win => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('email')).to.be.null;
    });*/
  });

});