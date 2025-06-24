/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to tab to the next focusable element.
       * @example cy.get('body').tab()
       */
      tab(): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to login with mock credentials.
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to check accessibility violations.
       */
      checkA11y(context?: any, options?: any): Chainable<void>;
      
      /**
       * Custom command to inject axe-core for accessibility testing.
       */
      injectAxe(): Chainable<void>;
    }
  }
}

// Custom command to select elements by data-cy attribute
Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});

// Custom command for keyboard navigation
Cypress.Commands.add('tab', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject).trigger('keydown', { key: 'Tab' });
});

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/auth/signin');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

// Accessibility testing commands
Cypress.Commands.add('injectAxe', () => {
  cy.window({ log: false }).then((win) => {
    const script = win.document.createElement('script');
    script.src = 'https://unpkg.com/axe-core@4.7.0/axe.min.js';
    win.document.head.appendChild(script);
  });
});

Cypress.Commands.add('checkA11y', (context?: any, options?: any) => {
  cy.window({ log: false }).then((win) => {
    if (win.axe) {
      return win.axe.run(context || win.document, options || {});
    }
  }).then((results) => {
    if (results && results.violations.length > 0) {
      cy.task('log', {
        message: 'Accessibility violations found:',
        violations: results.violations,
      });
      
      throw new Error(
        `${results.violations.length} accessibility violation(s) detected`
      );
    }
  });
});

export {};