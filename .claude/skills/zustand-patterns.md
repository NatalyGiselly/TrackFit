---
description: Zustand state management patterns for TrackFit
skill_type: architecture
---

# Zustand Patterns Skill

Expert guidance on Zustand state management for TrackFit.

## When to Use Zustand

✅ Use Zustand for:
- Global UI state (modals, sidebars, theme)
- User session/authentication
- App-wide preferences
- Derived client state
- Cross-component coordination

❌ Don't use Zustand for:
- Server/API data (use React Query)
- Single-component state (use useState)
- Form state (use react-hook-form or useState)

## Store Patterns

### Basic Store
```typescript
import { create } from 'zustand';

type CounterStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### Persisted Store
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      notifications: true,
      setTheme: (theme) => set({ theme }),
      toggleNotifications: () => set((state) => ({
        notifications: !state.notifications
      })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Store with Immer
```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type TodoStore = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
};

export const useTodoStore = create<TodoStore>()(
  immer((set) => ({
    todos: [],
    addTodo: (text) => set((state) => {
      state.todos.push({ id: Date.now().toString(), text, done: false });
    }),
    toggleTodo: (id) => set((state) => {
      const todo = state.todos.find(t => t.id === id);
      if (todo) todo.done = !todo.done;
    }),
  }))
);
```

### Async Actions
```typescript
type UserStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  fetchUser: (id: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const user = await api.getUser(id);
      set({ user, isLoading: false });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  updateUser: async (data) => {
    const currentUser = get().user;
    if (!currentUser) return;

    // Optimistic update
    set({ user: { ...currentUser, ...data } });

    try {
      const updated = await api.updateUser(currentUser.id, data);
      set({ user: updated });
    } catch (error) {
      // Rollback on error
      set({ user: currentUser, error: error.message });
    }
  },
}));
```

### Sliced Store
```typescript
type ThemeSlice = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

type AuthSlice = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const createThemeSlice = (set): ThemeSlice => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
});

const createAuthSlice = (set): AuthSlice => ({
  user: null,
  setUser: (user) => set({ user }),
});

export const useAppStore = create<ThemeSlice & AuthSlice>()((...a) => ({
  ...createThemeSlice(...a),
  ...createAuthSlice(...a),
}));
```

## Selectors

### Basic Selector
```typescript
// In store file
export const selectCompletedTodos = (state: TodoStore) =>
  state.todos.filter(t => t.done);

// In component
const completedTodos = useTodoStore(selectCompletedTodos);
```

### Computed Values
```typescript
export const selectTodoStats = (state: TodoStore) => ({
  total: state.todos.length,
  completed: state.todos.filter(t => t.done).length,
  pending: state.todos.filter(t => !t.done).length,
});
```

### Multiple Selectors
```typescript
// Avoid - rerenders on any state change
const { todos, filter } = useTodoStore();

// Better - rerenders only when todos change
const todos = useTodoStore((state) => state.todos);

// Best - with shallow comparison
import { shallow } from 'zustand/shallow';

const { todos, filter } = useTodoStore(
  (state) => ({ todos: state.todos, filter: state.filter }),
  shallow
);
```

## Testing Stores

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounterStore } from '../counter-store';

describe('CounterStore', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it('increments counter', () => {
    const { result } = renderHook(() => useCounterStore());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements counter', () => {
    const { result } = renderHook(() => useCounterStore());

    act(() => {
      result.current.increment();
      result.current.decrement();
    });

    expect(result.current.count).toBe(0);
  });

  it('resets counter', () => {
    const { result } = renderHook(() => useCounterStore());

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(0);
  });
});
```

## Best Practices

1. **Single Responsibility**: One store per domain
2. **Minimal State**: Only store what you need
3. **Derived Data**: Use selectors, not stored state
4. **Immutability**: Use immer for complex updates
5. **Type Safety**: Always type your stores
6. **Testing**: Test stores in isolation
7. **Performance**: Use selectors to prevent re-renders

## Common Mistakes

❌ Storing all state in one store
❌ Storing derived values
❌ Using stores for server data
❌ Not typing stores properly
❌ Mutating state directly (without immer)
❌ Over-optimizing selectors
❌ Mixing concerns in one store

## Migration from Context

```typescript
// Before (Context)
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// After (Zustand)
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Remove Provider from app tree
// Replace useContext(AuthContext) with useAuthStore()
```
