---
description: Create React Query hooks for API integration
---

Create React Query hooks following TrackFit patterns:

1. Type-safe with Zod validation
2. Proper query keys structure
3. Error handling
4. Cache invalidation for mutations
5. Optimistic updates where appropriate

Structure:
```typescript
// hooks/use-[domain].ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { [domain]Service } from '../services/[domain]-service';

export function use[Domain]() {
  return useQuery({
    queryKey: ['[domain]'],
    queryFn: [domain]Service.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreate[Domain]() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: [domain]Service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[domain]'] });
    },
  });
}
```

Ask me for:
1. Domain/resource name (e.g., "workout", "exercise")
2. Required operations (get, list, create, update, delete)
3. API endpoint details
4. Data shape/schema
5. Any special requirements (pagination, infinite scroll, optimistic updates)

Then generate:
- Service file in src/services/
- Hook file in src/hooks/
- Zod schema for validation
- Type definitions
