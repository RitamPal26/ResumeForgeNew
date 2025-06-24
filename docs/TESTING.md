# Testing Documentation

## Overview

This document outlines the comprehensive testing strategy for ResumeForge, including unit tests, integration tests, end-to-end tests, and accessibility testing.

## Testing Stack

- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Cypress
- **Accessibility Testing**: axe-core + Cypress
- **Performance Testing**: Lighthouse CI
- **Visual Regression**: Cypress (screenshots)

## Test Coverage Goals

- **Unit Tests**: 80% code coverage minimum
- **Critical Paths**: 100% E2E coverage
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals targets

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### E2E Tests
```bash
# Open Cypress Test Runner
npm run test:e2e

# Run E2E tests headlessly
npm run test:e2e:headless
```

### Performance Tests
```bash
# Run Lighthouse audit
npm run lighthouse
```

## Test Structure

### Unit Tests (`src/test/`)
- **Components**: Test component rendering, props, user interactions
- **Hooks**: Test custom hook behavior and state management
- **Services**: Test API calls, data transformation, error handling
- **Utils**: Test utility functions and helpers

### E2E Tests (`cypress/e2e/`)
- **Authentication**: Sign in/up flows, session management
- **Dashboard**: Navigation, data display, user interactions
- **Analysis**: Profile analysis workflow
- **Accessibility**: WCAG compliance, keyboard navigation

### Test Utilities (`src/test/utils/`)
- **testUtils.tsx**: Custom render function with providers
- **mockData.ts**: Mock data for testing
- **helpers.ts**: Test helper functions

## Writing Tests

### Unit Test Example
```typescript
import { render, screen, fireEvent } from '../utils/testUtils';
import { Button } from '../../components/ui/Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Test Example
```typescript
describe('Dashboard', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password');
    cy.visit('/dashboard');
  });

  it('should display user metrics', () => {
    cy.get('[data-cy="metrics-card"]').should('have.length', 4);
    cy.get('[data-cy="total-analyses"]').should('contain', '12');
  });
});
```

### Accessibility Test Example
```typescript
describe('Accessibility', () => {
  it('should not have accessibility violations', () => {
    cy.visit('/dashboard');
    cy.injectAxe();
    cy.checkA11y();
  });

  it('should support keyboard navigation', () => {
    cy.visit('/');
    cy.get('body').tab();
    cy.focused().should('have.attr', 'role', 'button');
  });
});
```

## Test Data Management

### Mock Data
- Use consistent mock data across tests
- Store in `src/test/utils/mockData.ts`
- Include realistic data variations

### API Mocking
- Mock Supabase client in tests
- Use MSW for complex API scenarios
- Simulate error conditions

## Performance Testing

### Core Web Vitals Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

### Lighthouse Configuration
```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
      },
    },
  },
};
```

## Accessibility Testing

### WCAG 2.1 AA Requirements
- **Perceivable**: Text alternatives, captions, color contrast
- **Operable**: Keyboard accessible, no seizures, navigable
- **Understandable**: Readable, predictable
- **Robust**: Compatible with assistive technologies

### Testing Checklist
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader compatibility (NVDA, VoiceOver)
- [ ] Color contrast ratios meet AA standards
- [ ] Focus indicators are visible
- [ ] Form labels are properly associated
- [ ] Heading hierarchy is logical
- [ ] ARIA labels and roles are correct

## Cross-Browser Testing

### Supported Browsers
- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Android Chrome 90+

### Testing Strategy
- Automated tests run on Chrome (Cypress)
- Manual testing on other browsers
- BrowserStack for comprehensive coverage

## Mobile Testing

### Device Testing
- **Phones**: iPhone 12/13, Samsung Galaxy S21, Pixel 5
- **Tablets**: iPad Air, Samsung Galaxy Tab
- **Viewports**: 320px, 375px, 768px, 1024px

### Touch Interactions
- Minimum 44x44px touch targets
- Swipe gestures for navigation
- Proper touch feedback

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e:headless
      - run: npm run lighthouse
```

## Test Maintenance

### Regular Tasks
- Update test data to match schema changes
- Review and update accessibility tests
- Monitor performance regression
- Update browser compatibility matrix

### Best Practices
- Keep tests simple and focused
- Use descriptive test names
- Avoid testing implementation details
- Mock external dependencies
- Clean up after tests

## Debugging Tests

### Common Issues
- **Flaky tests**: Add proper waits, use data-cy attributes
- **Slow tests**: Mock heavy operations, optimize selectors
- **Memory leaks**: Clean up event listeners, timers

### Debugging Tools
- Cypress Test Runner for E2E debugging
- Vitest UI for unit test debugging
- Browser DevTools for performance analysis

## Reporting

### Coverage Reports
- Generated in `coverage/` directory
- HTML report for detailed analysis
- JSON report for CI integration

### Test Results
- JUnit XML for CI systems
- Screenshots for failed E2E tests
- Performance metrics tracking