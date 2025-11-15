# Expo + React Native - TrackFit Standards

## Stack
- Expo SDK 54
- React Native 0.81.5
- React 19.1.0
- TypeScript (strict mode)
- React Navigation v7
- Zustand (state management)
- React Query (server state)
- AsyncStorage (persistence layer)

## Architecture Principles

### Project Structure
```
src/
├── components/        # Reusable UI components
├── screens/          # Screen components
├── navigation/       # Navigation configuration
├── stores/           # Zustand stores
├── hooks/            # Custom hooks
├── services/         # API calls, business logic
├── config/           # App configuration, constants
├── types/            # TypeScript types
└── utils/            # Pure utility functions
```

### Feature-based Organization (Target)
```
src/
├── auth/
│   ├── components/
│   ├── screens/
│   ├── hooks/
│   ├── services/
│   ├── store.ts
│   └── types.ts
├── workouts/
│   ├── components/
│   ├── screens/
│   ├── store.ts
│   └── types.ts
└── shared/
    ├── components/
    ├── stores/
    └── utils/
```

## Code Standards

### TypeScript
- strict mode enabled
- no `any` or `as` (unless absolutely necessary)
- prefer types over interfaces
- co-locate types with usage
- use inference for return types when clear

### React Native Components
- named exports only
- functional components with hooks
- memo for pure components
- useCallback for event handlers passed as props
- avoid inline styles in render (define in StyleSheet.create)

### State Management Strategy

#### Zustand for Client State
- UI state (modals, drawers, selected items)
- user preferences (theme, language)
- app-wide state (current user, auth status)
- derived state from server data
- ephemeral state that needs global access

#### React Query for Server State
- API data fetching
- cache management
- background refetching
- optimistic updates
- infinite queries

#### Local State for Component-Only
- form inputs
- component-specific UI state
- temporary values

### Zustand Patterns

#### Store Structure
```typescript
// stores/auth-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

#### Computed Values (Selectors)
```typescript
// stores/workout-store.ts
import { create } from 'zustand';

type Exercise = {
  id: string;
  name: string;
  completed: boolean;
};

type WorkoutStore = {
  exercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  toggleComplete: (id: string) => void;
  clearCompleted: () => void;
};

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  exercises: [],

  addExercise: (exercise) => set((state) => ({
    exercises: [...state.exercises, exercise]
  })),

  toggleComplete: (id) => set((state) => ({
    exercises: state.exercises.map(ex =>
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    )
  })),

  clearCompleted: () => set((state) => ({
    exercises: state.exercises.filter(ex => !ex.completed)
  })),
}));

// Selectors for computed values
export const selectCompletedCount = (state: WorkoutStore) =>
  state.exercises.filter(ex => ex.completed).length;

export const selectPendingCount = (state: WorkoutStore) =>
  state.exercises.filter(ex => !ex.completed).length;

// Usage in components
const completedCount = useWorkoutStore(selectCompletedCount);
```

#### Store Slicing (Multiple Concerns)
```typescript
// stores/app-store.ts
import { create } from 'zustand';

type ThemeSlice = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

type NotificationSlice = {
  notifications: string[];
  addNotification: (message: string) => void;
  clearNotifications: () => void;
};

const createThemeSlice = (set): ThemeSlice => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
});

const createNotificationSlice = (set): NotificationSlice => ({
  notifications: [],
  addNotification: (message) => set((state) => ({
    notifications: [...state.notifications, message]
  })),
  clearNotifications: () => set({ notifications: [] }),
});

export const useAppStore = create<ThemeSlice & NotificationSlice>()(
  (set) => ({
    ...createThemeSlice(set),
    ...createNotificationSlice(set),
  })
);
```

#### Async Actions with Zustand
```typescript
// stores/user-store.ts
import { create } from 'zustand';
import { userService } from '../services/user-service';

type UserStore = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userService.getProfile(userId);
      set({ profile, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  updateProfile: async (data) => {
    const currentProfile = get().profile;
    if (!currentProfile) return;

    set({ isLoading: true });
    try {
      const updated = await userService.updateProfile(currentProfile.id, data);
      set({ profile: updated, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },
}));
```

#### DevTools Integration
```typescript
// stores/workout-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type WorkoutStore = {
  // ... state
};

export const useWorkoutStore = create<WorkoutStore>()(
  devtools(
    (set) => ({
      // ... implementation
    }),
    { name: 'WorkoutStore' }
  )
);
```

### React Query + Zustand Integration

```typescript
// hooks/use-user-profile.ts
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth-store';
import { userService } from '../services/user-service';

export function useUserProfile() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => userService.getProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Performance

#### Zustand Best Practices
- use shallow comparison for multiple selectors
- split stores by domain (auth, workout, ui)
- avoid storing derived data (use selectors)
- use immer middleware for complex updates

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useStore = create<State>()(
  immer((set) => ({
    nested: { data: [] },
    addItem: (item) => set((state) => {
      state.nested.data.push(item); // immer allows mutation
    }),
  }))
);
```

#### Component Optimization
- use React.memo for expensive components
- useCallback for event handlers passed as props
- select only needed state from stores

```typescript
// Bad - re-renders on any store change
const { user, exercises, theme } = useAppStore();

// Good - re-renders only when user changes
const user = useAppStore((state) => state.user);
```

### Styling
- StyleSheet.create at file bottom
- shared theme in stores/theme-store.ts
- responsive units (Dimensions, useWindowDimensions)
- consistent spacing scale (4, 8, 12, 16, 24, 32)
- semantic color names (primary, secondary, error)

### Error Handling
- try/catch with proper error types
- error boundaries for screen-level errors
- toast notifications for user-facing errors
- logging service (Sentry) for tracking
- never silent failures
- store error state in Zustand for UI feedback

### Security
- never store sensitive data unencrypted
- use expo-secure-store for tokens (not Zustand persist)
- validate all user input (Zod)
- sanitize data before storage
- HTTPS only for API calls

### Accessibility
- accessibilityLabel on all interactive elements
- accessibilityHint for complex actions
- accessibilityRole for semantic meaning
- test with VoiceOver (iOS) / TalkBack (Android)
- minimum touch target 44x44pt
- WCAG AA contrast ratio (4.5:1 text, 3:1 UI)

### Data Management Decision Tree

```
Is this data from the server?
├─ Yes → Use React Query
│
Is this data global across app?
├─ Yes → Use Zustand
│
Is this data needed in multiple unrelated components?
├─ Yes → Use Zustand
│
Is this UI state for a single component?
├─ Yes → Use local useState
│
Is this form state?
├─ Yes → Use react-hook-form or local state
│
Default → Use local useState
```

### Navigation
- type-safe with RootStackParamList
- deep linking configured
- analytics tracking on screen change
- proper back button behavior
- loading states during navigation

## Anti-Patterns to Avoid

### NEVER
- useEffect for data fetching (use React Query)
- plain text passwords in storage
- console.log in production code
- magic numbers without constants
- business logic in components
- default exports
- commented code in commits
- any type
- silent error catching
- storing server data in Zustand (use React Query)
- mutating Zustand state directly (without immer)

### MINIMIZE
- Context usage (use Zustand instead)
- prop drilling (use Zustand/composition)
- inline styles
- anonymous functions in render
- imperative code (prefer declarative)

## Testing

### Unit Tests
- Jest + React Native Testing Library
- test behavior, not implementation
- mock external dependencies
- descriptive test names (no "should")

### Testing Zustand Stores
```typescript
// stores/__tests__/auth-store.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthStore } from '../auth-store';

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('sets user and authentication status', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser({
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      });
    });

    expect(result.current.user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('clears user on logout', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser({
        id: '1',
        name: 'Test',
        email: 'test@test.com'
      });
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

### Integration Tests
- test user flows
- test navigation
- test async operations
- test error states

### E2E (Optional)
- Detox for critical paths
- login, signup, core features

## Tools & Libraries

### Required
- TypeScript
- ESLint (@react-native config)
- Prettier
- Zustand (state management)
- React Query (@tanstack/react-query)
- Zod (validation)
- date-fns (date manipulation)

### Recommended
- expo-image (optimized images)
- react-native-reanimated (animations)
- FlashList (performant lists)
- Sentry (error tracking)
- expo-updates (OTA updates)
- zustand/middleware (persist, devtools, immer)

### CI/CD
- EAS Build for native builds
- EAS Update for JS updates
- GitHub Actions for linting/tests
- preview builds on PR

## Environment Management

### Config Structure
```typescript
// config/index.ts
export const config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    timeout: 30000,
  },
  auth: {
    tokenKey: '@app:token',
  },
  features: {
    analytics: __DEV__ ? false : true,
  },
} as const;
```

### Environment Variables
- use EXPO_PUBLIC_ prefix for client-side vars
- validate at startup with Zod
- never commit .env files
- document in .env.example

## Performance Budgets

### Bundle Size
- JS bundle < 5MB
- assets optimized (images WebP, SVGs)
- code splitting for large screens

### Metrics
- TTI (Time to Interactive) < 2s
- FPS 60 (animations)
- Memory < 200MB (typical usage)

## Git Workflow

### Commits
- conventional commits (feat, fix, refactor, etc)
- concise messages, no Claude Code prefix
- atomic commits (one logical change)

### Branches
- main: production-ready code
- develop: integration branch
- feature/*, fix/*: feature branches

### Pre-commit
- ESLint auto-fix
- Prettier format
- TypeScript check
- tests run on CI

## Documentation

### Code Comments
- avoid comments (make code self-documenting)
- JSDoc for exported functions/types
- README for setup instructions
- CONTRIBUTING for team guidelines

### Inline Docs
- only for non-obvious logic
- explain "why", not "what"
- update with code changes

## Observability

### Logging
- structured logs (JSON format)
- log levels (debug, info, warn, error)
- context (user ID, screen, action)
- production logger (Sentry, LogRocket)

### Analytics
- track screen views
- track user actions
- track errors
- performance metrics

### Monitoring
- crash reporting (Sentry)
- performance monitoring
- API error rates
- user engagement metrics

## Deployment

### Release Process
1. Update version in package.json, app.json
2. Run tests
3. Build with EAS (production profile)
4. Submit to stores
5. Deploy OTA update for minor changes

### Versioning
- Semantic versioning (MAJOR.MINOR.PATCH)
- changelog in CHANGELOG.md
- git tags for releases

## Common Patterns

### Zustand Store Pattern
```typescript
// stores/workout-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
};

type WorkoutStore = {
  workouts: Workout[];
  selectedWorkout: Workout | null;

  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt'>) => void;
  removeWorkout: (id: string) => void;
  selectWorkout: (id: string) => void;
  clearSelection: () => void;
};

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workouts: [],
      selectedWorkout: null,

      addWorkout: (data) => set((state) => ({
        workouts: [
          ...state.workouts,
          {
            ...data,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          }
        ]
      })),

      removeWorkout: (id) => set((state) => ({
        workouts: state.workouts.filter(w => w.id !== id),
        selectedWorkout: state.selectedWorkout?.id === id
          ? null
          : state.selectedWorkout,
      })),

      selectWorkout: (id) => {
        const workout = get().workouts.find(w => w.id === id);
        set({ selectedWorkout: workout || null });
      },

      clearSelection: () => set({ selectedWorkout: null }),
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### React Query Pattern
```typescript
// hooks/use-workouts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutService } from '../services/workout-service';

export function useWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: workoutService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workoutService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}
```

### Component Pattern
```typescript
// components/button.tsx
import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button = memo<ButtonProps>(({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#E0E0E0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### Service Pattern
```typescript
// services/workout-service.ts
import { z } from 'zod';
import { config } from '../config';

const WorkoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  exercises: z.array(z.object({
    id: z.string(),
    name: z.string(),
    sets: z.number(),
    reps: z.number(),
  })),
});

export type Workout = z.infer<typeof WorkoutSchema>;

export const workoutService = {
  async getAll(): Promise<Workout[]> {
    const response = await fetch(`${config.api.baseUrl}/workouts`);
    const data = await response.json();
    return z.array(WorkoutSchema).parse(data);
  },

  async create(workout: Omit<Workout, 'id'>): Promise<Workout> {
    const response = await fetch(`${config.api.baseUrl}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    });
    const data = await response.json();
    return WorkoutSchema.parse(data);
  },
};
```

## Migration Path (Current → Target)

### Phase 1: Add Zustand
1. Install zustand
2. Create auth-store.ts (replace AuthContext)
3. Create ui-store.ts (modals, loading, theme)
4. Update components to use stores

### Phase 2: Add React Query
1. Install @tanstack/react-query
2. Setup QueryClientProvider
3. Move data fetching from useEffect to useQuery
4. Implement mutations with optimistic updates

### Phase 3: Cleanup
1. Remove Context files (AuthContext, LoadingContext)
2. Extract hardcoded data to services
3. Add error boundaries
4. Implement proper logging

## Resources

- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zod Docs](https://zod.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
