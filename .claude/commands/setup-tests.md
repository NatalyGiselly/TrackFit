---
description: Setup testing infrastructure and write tests
---

Setup testing for TrackFit following best practices:

1. Configure Jest + React Native Testing Library
2. Setup test utilities and custom renders
3. Mock configuration for common dependencies
4. Create test patterns documentation

For new tests:
1. Unit tests for:
   - Zustand stores
   - Utility functions
   - Services
   - Custom hooks

2. Integration tests for:
   - User flows
   - Navigation
   - Forms
   - API interactions

3. Component tests for:
   - Rendering
   - User interactions
   - State changes
   - Accessibility

Test structure:
```typescript
describe('[Component/Feature]', () => {
  beforeEach(() => {
    // setup
  });

  afterEach(() => {
    // cleanup
  });

  it('renders correctly', () => {
    // test
  });

  it('handles user interaction', () => {
    // test
  });

  it('displays error states', () => {
    // test
  });
});
```

Ask me what to test, then:
1. Identify test type needed
2. Setup mocks if required
3. Write comprehensive test cases
4. Ensure coverage of happy path and edge cases
