describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to sign in page', () => {
    cy.get('[data-cy="sign-in-button"]').click();
    cy.url().should('include', '/auth/signin');
    cy.get('h2').should('contain', 'Welcome back');
  });

  it('should navigate to sign up page', () => {
    cy.get('[data-cy="get-started-button"]').click();
    cy.url().should('include', '/auth/signup');
    cy.get('h2').should('contain', 'Create your account');
  });

  it('should show validation errors for empty form', () => {
    cy.visit('/auth/signin');
    cy.get('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission
    cy.get('input[type="email"]:invalid').should('exist');
    cy.get('input[type="password"]:invalid').should('exist');
  });

  it('should show error for invalid credentials', () => {
    cy.visit('/auth/signin');
    
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.get('[role="alert"]').should('be.visible');
  });

  it('should toggle password visibility', () => {
    cy.visit('/auth/signin');
    
    cy.get('input[type="password"]').should('have.attr', 'type', 'password');
    cy.get('[data-cy="toggle-password"]').click();
    cy.get('input[type="text"]').should('exist');
    cy.get('[data-cy="toggle-password"]').click();
    cy.get('input[type="password"]').should('exist');
  });

  it('should be accessible via keyboard navigation', () => {
    cy.visit('/auth/signin');
    
    // Tab through form elements
    cy.get('body').tab();
    cy.focused().should('have.attr', 'type', 'email');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'type', 'password');
    
    cy.focused().tab();
    cy.focused().should('contain', 'Keep me signed in');
  });
});