describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should not have accessibility violations on landing page', () => {
    cy.checkA11y();
  });

  it('should not have accessibility violations on sign in page', () => {
    cy.visit('/auth/signin');
    cy.injectAxe();
    cy.checkA11y();
  });

  it('should not have accessibility violations on dashboard', () => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'mock-user-id', email: 'test@example.com' }
      }));
    });
    
    cy.visit('/dashboard');
    cy.injectAxe();
    cy.checkA11y();
  });

  it('should support keyboard navigation', () => {
    // Test tab navigation through main elements
    cy.get('body').tab();
    cy.focused().should('have.attr', 'role', 'button');
    
    // Continue tabbing through interactive elements
    for (let i = 0; i < 5; i++) {
      cy.focused().tab();
      cy.focused().should('be.visible');
    }
  });

  it('should have proper heading hierarchy', () => {
    cy.get('h1').should('exist');
    cy.get('h1').should('have.length', 1);
    
    // Check that headings follow proper hierarchy
    cy.get('h1, h2, h3, h4, h5, h6').then(($headings) => {
      const headingLevels = Array.from($headings).map(h => parseInt(h.tagName.charAt(1)));
      
      // Verify no heading levels are skipped
      for (let i = 1; i < headingLevels.length; i++) {
        const diff = headingLevels[i] - headingLevels[i - 1];
        expect(diff).to.be.at.most(1);
      }
    });
  });

  it('should have proper ARIA labels and roles', () => {
    // Check for proper button labels
    cy.get('button').each(($button) => {
      cy.wrap($button).should('satisfy', ($el) => {
        return $el.attr('aria-label') || $el.text().trim().length > 0;
      });
    });
    
    // Check for proper form labels
    cy.get('input').each(($input) => {
      const id = $input.attr('id');
      if (id) {
        cy.get(`label[for="${id}"]`).should('exist');
      }
    });
  });

  it('should have sufficient color contrast', () => {
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
  });

  it('should support screen readers', () => {
    // Check for skip links
    cy.get('a[href="#main-content"]').should('exist');
    
    // Check for proper landmarks
    cy.get('main').should('exist');
    cy.get('nav').should('exist');
    cy.get('header').should('exist');
    cy.get('footer').should('exist');
  });
});