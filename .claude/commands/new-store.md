---
description: Create a new Zustand store following TrackFit patterns
---

Create a new Zustand store with the following requirements:

1. TypeScript with strict typing
2. Use persist middleware if data needs persistence
3. Include proper JSDoc comments for public API
4. Follow naming convention: use[Domain]Store
5. Structure:
   - State type definition
   - Store creation with create()
   - Actions as methods
   - Selectors exported separately
6. Co-locate with feature if feature-specific, otherwise in src/stores/
7. Include basic test file in __tests__/ directory

Example structure:
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type [Domain]State = {
  // state properties
};

type [Domain]Store = [Domain]State & {
  // actions
};

export const use[Domain]Store = create<[Domain]Store>()(
  persist(
    (set, get) => ({
      // initial state
      // actions
    }),
    {
      name: '[domain]-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const select[Something] = (state: [Domain]Store) => /* computed value */;
```

Ask me for:
1. Store domain name
2. State properties needed
3. Actions required
4. Whether persistence is needed
5. Any computed selectors
