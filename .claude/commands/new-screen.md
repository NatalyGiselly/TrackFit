---
description: Create a new React Native screen following TrackFit patterns
---

Create a new screen component with the following requirements:

1. TypeScript with proper navigation typing
2. Named export (no default export)
3. SafeAreaView wrapper
4. Accessibility labels on interactive elements
5. StyleSheet.create at bottom
6. Responsive design considerations
7. Error boundaries where appropriate
8. Loading states
9. Follow existing screen structure

Structure:
- Imports (React, RN components, navigation, stores/hooks, components)
- Type definitions (navigation props)
- Component function
- Styles

Ask me for:
1. Screen name (e.g., "Profile", "WorkoutDetail")
2. Navigation params if any
3. Required state (Zustand stores, React Query hooks)
4. Main UI elements/sections
5. Any special requirements (forms, lists, animations)

Then generate:
- Screen component file in src/screens/
- Add to RootStackParamList in src/types/navigation.ts
- Suggest where to add in navigation stack
