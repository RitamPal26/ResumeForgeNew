describe('Dashboard', () => {
  beforeEach(() => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'mock-user-id', email: 'test@example.com' }
      }));
    });
    
    cy.visit('/dashboard');
  });

  it('should display dashboard with metrics cards', () => {
    cy.get('[data-cy="dashboard-title"]').should('contain', 'Dashboard');
    
    // Check for metrics cards
    cy.get('[data-cy="metrics-card"]').should('have.length', 4);
    cy.get('[data-cy="metrics-card"]').first().should('contain', 'Total Resumes');
  });

  it('should navigate to different sections', () => {
    // Test sidebar navigation
    cy.get('[data-cy="nav-github"]').click();
    cy.get('[data-cy="github-integration"]').should('be.visible');
    
    cy.get('[data-cy="nav-developer"]').click();
    cy.get('[data-cy="developer-profile"]').should('be.visible');
    
    cy.get('[data-cy="nav-history"]').click();
    cy.url().should('include', '/history');
  });

  it('should display recent resumes table', () => {
    cy.get('[data-cy="recent-resumes-table"]').should('be.visible');
    cy.get('table thead th').should('contain', 'Name');
    cy.get('table thead th').should('contain', 'Status');
    cy.get('table thead th').should('contain', 'Score');
  });

  it('should handle responsive design', () => {
    // Test mobile view
    cy.viewport(375, 667);
    cy.get('[data-cy="mobile-menu-button"]').should('be.visible');
    cy.get('[data-cy="sidebar"]').should('not.be.visible');
    
    // Test tablet view
    cy.viewport(768, 1024);
    cy.get('[data-cy="sidebar"]').should('be.visible');
  });

  it('should show loading states', () => {
    // Intercept API calls to simulate loading
    cy.intercept('GET', '/api/resumes', { delay: 2000, body: [] }).as('getResumes');
    
    cy.visit('/dashboard');
    cy.get('[data-cy="loading-skeleton"]').should('be.visible');
    
    cy.wait('@getResumes');
    cy.get('[data-cy="loading-skeleton"]').should('not.exist');
  });

  it('should handle error states gracefully', () => {
    // Simulate API error
    cy.intercept('GET', '/api/resumes', { statusCode: 500 }).as('getResumesError');
    
    cy.visit('/dashboard');
    cy.wait('@getResumesError');
    
    cy.get('[data-cy="error-message"]').should('be.visible');
    cy.get('[data-cy="retry-button"]').should('be.visible');
  });
});