# BearWithMe React Native App

## Folder Structure

```
├── App.tsx                 # Entry point
├── SignUpScreen.tsx        # Root level signup (legacy)
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── babel.config.js        # Babel configuration
├── src/
│   ├── navigation/        # Navigation setup
│   │   └── RootNavigator.tsx
│   ├── screens/           # App screens (new location)
│   ├── components/        # Reusable components
│   ├── constants/         # Constants and theme
│   │   └── theme.ts
│   └── types/            # TypeScript types
│       └── index.ts
├── screens/              # Legacy screens location
└── assets/              # App assets (icons, splash, etc.)
```

## Setup & Installation

```bash
npm install
npm start           # Start dev server
npm run android     # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

## TypeScript Configuration

- Strict mode enabled
- ESModule interop enabled
- JSX support configured
- Path aliases for easier imports (@screens, @components, etc.)

## File Organization

### Auth Flow
- `screens/LoginScreen.tsx` - User login
- `SignUpScreen.tsx` - User signup (root level, should move to src/)

### Onboarding Flow
- `screens/OnboardingStep1.tsx` - User profile (name, birthday, chat style)
- `screens/OnboardingStep2.tsx` - Daily schedule (sleep, wake time, habit)
- `screens/OnboardingStep3.tsx` - Stress triggers
- `screens/OnboardingComplete.tsx` - Completion celebration

### Main App Flow
- `screens/HomeScreen.tsx` - Dashboard and mood selection
- `screens/ProfileScreen.tsx` - User profile (coming soon)
- `screens/ChatScreen.tsx` - Chat with Adam (AI)

### Journal Flow
- `screens/JournalsScreen.tsx` - List of journal entries
- `screens/JournalWritingScreen.tsx` - Journal writing step 1
- `screens/JournalStep3Screen.tsx` - Journal step 3
- `screens/JournalCompletedScreen.tsx` - Journal completion view

## Design System

Colors defined in `src/constants/theme.ts`:
- Primary: `#7857e1`
- Background: `#f3eded`
- White: `#ffffff`
- Text Primary: `#302f2f`

## Next Steps

1. Move `SignUpScreen.tsx` to `src/screens/`
2. Move all existing screens to `src/screens/` 
3. Create reusable components in `src/components/`
4. Implement state management (Redux, Context, etc.)
5. Add API integration
6. Implement authentication
