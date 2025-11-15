---
description: Refactor React Context to Zustand store
---

Convert an existing React Context to a Zustand store following best practices:

1. Analyze current Context API usage
2. Map state to Zustand store structure
3. Convert actions to store methods
4. Replace Context Provider with store
5. Update all useContext calls to Zustand selectors
6. Add persistence if needed
7. Remove Context file after migration
8. Update imports across codebase

Migration checklist:
- [ ] Create new Zustand store
- [ ] Map all state properties
- [ ] Convert all actions/functions
- [ ] Add persistence middleware if needed
- [ ] Find all useContext usages
- [ ] Replace with Zustand selectors
- [ ] Remove Provider from component tree
- [ ] Test all affected components
- [ ] Delete Context file

Ask me which Context to migrate, then:
1. Analyze the Context file
2. Show proposed Zustand store structure
3. List all files that need updates
4. Execute migration step by step
5. Run tests to verify
