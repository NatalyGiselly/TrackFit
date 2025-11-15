---
description: Expo + React Native development patterns and best practices for TrackFit
skill_type: coding
---

# Expo + React Native Development Skill

Use this skill when working on React Native + Expo features for TrackFit.

## Core Principles

1. **Type Safety First**
   - Strict TypeScript, no `any`
   - Infer types when possible
   - Validate external data with Zod

2. **State Management**
   - Zustand for client state (UI, preferences, auth)
   - React Query for server state (API data)
   - Local state for component-only concerns

3. **Performance**
   - React.memo for pure components
   - useCallback for prop functions
   - Proper selector usage in Zustand
   - FlatList/FlashList for lists

4. **Accessibility**
   - accessibilityLabel on all touchables
   - WCAG AA contrast ratios
   - 44x44pt minimum touch targets

5. **Code Organization**
   - Named exports only
   - Co-locate related code
   - Feature-based structure when possible

## Code Patterns

### Component Template
```typescript
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComponentProps {
  title: string;
  onPress?: () => void;
}

export const Component = memo<ComponentProps>(({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
});

Component.displayName = 'Component';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

### Zustand Store
```typescript
import { create } from 'zustand';

type Store = {
  count: number;
  increment: () => void;
};

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### React Query Hook
```typescript
import { useQuery } from '@tanstack/react-query';

export function useData() {
  return useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000,
  });
}
```

## Anti-Patterns to Avoid

- ❌ Default exports
- ❌ console.log in code
- ❌ useEffect for data fetching
- ❌ Storing server data in Zustand
- ❌ Inline styles
- ❌ Magic numbers
- ❌ Business logic in components
- ❌ Any type
- ❌ Commented code

## When to Use This Skill

- Creating new React Native components
- Adding new screens
- Implementing navigation
- Working with Zustand stores
- Integrating APIs with React Query
- Optimizing performance
- Fixing accessibility issues
- Refactoring existing code

## Quick Reference

### Imports Order
1. React
2. React Native
3. Third-party libraries
4. Navigation
5. Stores/hooks
6. Components
7. Types
8. Utils

### File Naming
- Components: `button.tsx` (lowercase kebab-case)
- Screens: `home-screen.tsx`
- Stores: `auth-store.ts`
- Hooks: `use-workouts.ts`
- Services: `workout-service.ts`

### Common Zustand Patterns
```typescript
// Selection
const user = useAuthStore((state) => state.user);

// Multiple selections
const { user, isAuthenticated } = useAuthStore(
  (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
);

// With selector
const count = useStore(selectCompletedCount);
```

### Error Handling
```typescript
try {
  await action();
} catch (error) {
  // Log to monitoring service
  logger.error('Action failed', { error, context });

  // Show user-friendly message
  showToast('Something went wrong. Please try again.');
}
```
