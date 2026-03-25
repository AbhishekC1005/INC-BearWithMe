# Project Structure Guide

## Overview

BearWithMe is a React Native mental wellness companion app built with Expo and TypeScript.

## Directory Structure

```
new/
├── App.tsx                          # Root entry point
├── SignUpScreen.tsx                 # Root signup (legacy - should move to src/)
├── app.json                         # Expo configuration
├── babel.config.js                  # Babel transformer config
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript compiler options
├── .eslintrc.json                   # ESLint configuration
├── .prettierrc                       # Code formatting rules
├── .gitignore                       # Git ignore rules
├── README.md                        # Project overview
├── STRUCTURE.md                     # This file
│
├── assets/                          # App assets
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
│
├── screens/                         # Legacy screen folder (OLD LOCATION)
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ChatScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── JournalsScreen.tsx
│   ├── JournalWritingScreen.tsx
│   ├── JournalStep3Screen.tsx
│   ├── JournalCompletedScreen.tsx
│   ├── OnboardingStep1.tsx
│   ├── OnboardingStep2.tsx
│   ├── OnboardingStep3.tsx
│   └── OnboardingComplete.tsx
│
├── src/                             # NEW SOURCE (Future location for all screens)
│   ├── navigation/                  # Navigation setup
│   │   └── RootNavigator.tsx        # Main stack navigator configuration
│   │
│   ├── screens/                     # UI Screens (empty - migration planned)
│   │   # All screens will eventually move here
│   │
│   ├── components/                  # Reusable UI Components (empty - ready for use)
│   │
│   ├── constants/                   # App constants
│   │   └── theme.ts                 # Design tokens (colors, spacing, font sizes)
│   │
│   └── types/                       # TypeScript type definitions
│       └── index.ts                 # Shared types & interfaces
│
└── node_modules/                    # Dependencies (auto-generated)
```

## Key Files Explained

### Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript compilation settings, path aliases, strict mode |
| `babel.config.js` | Babel transformer for Expo/React Native |
| `app.json` | Expo app metadata (name, icon, permissions, etc.) |
| `package.json` | Dependencies, scripts, project metadata |
| `.eslintrc.json` | Code linting rules |
| `.prettierrc` | Code formatting standards |

### Source Architecture

#### App Entry (`App.tsx`)
- Initializes NavigationContainer
- Renders RootNavigator from `src/navigation/`

#### Navigation (`src/navigation/RootNavigator.tsx`)
- Defines the complete app flow using NativeStackNavigator
- Imports all screens from their current locations
- Sets up the initial route and screen options

#### Type System (`src/types/index.ts`)
- `RootStackParamList`: Navigation parameter types
- `JournalEntry`: Journal data structure
- `MoodOption`: Mood selection data
- `OnboardingData`: Onboarding form data
- `NavigationProp`: Type for useNavigation() hook

#### Design System (`src/constants/theme.ts`)
- Centralized color palette
- Font size scale
- Spacing tokens
- Border radius values
- Exported as constants for TypeScript safety

## Screen Organization

### Authentication Flow
```
LoginScreen → SignUpScreen → OnboardingStep1 → OnboardingStep2 → OnboardingStep3 → OnboardingComplete → Home
```

### Main App Flow (After Auth)
```
Home
├── Journal Writing Flow
│   ├── JournalWritingScreen
│   ├── JournalStep3Screen
│   └── JournalCompletedScreen
├── Chat with Adam
│   └── ChatScreen
├── View Journals
│   └── JournalsScreen
└── Profile
    └── ProfileScreen
```

## TypeScript Setup

### Strict Mode Features
- ✅ `esModuleInterop`: Proper ES module interoperation
- ✅ `strict`: All strict type-checking options enabled
- ✅ `jsx: "react-jsx"`: JSX support with automatic import
- ✅ `noImplicitAny`: Requires explicit types
- ✅ `strictNullChecks`: Strict null/undefined checking
- ✅ Path aliases for clean imports

### Path Aliases (Available in tsconfig.json)
```typescript
// Instead of:
import HomeScreen from '../../../screens/HomeScreen';

// Use:
import HomeScreen from '@screens/HomeScreen';
```

Configured paths:
- `@/*` → `./src/*`
- `@screens/*` → `./src/screens/*` (when screens move)
- `@components/*` → `./src/components/*`
- `@navigation/*` → `./src/navigation/*`
- `@constants/*` → `./src/constants/*`
- `@types/*` → `./src/types/*`

## NPM Scripts

```bash
npm start          # Start dev server (choose platform)
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run on web browser
npm install        # Install dependencies
npm list           # List installed packages
npm audit fix      # Fix security vulnerabilities
```

## Migration Plan

The project will eventually follow this structure:

1. ✅ Create `src/` folder structure
2. ✅ Set up TypeScript strict mode
3. ✅ Create navigation configuration
4. ✅ Define types
5. ✅ Create design system
6. 🔄 Move/refactor all screens to `src/screens/`
7. 🔄 Create reusable components in `src/components/`
8. 🔄 Implement state management (Redux/Context)
9. 🔄 Add API integration layer
10. 🔄 Add authentication state management

## Common Issues & Solutions

### Import Path Issues
If you get import errors:
1. Check tsconfig.json path aliases
2. Ensure file extension is included in import
3. Use absolute paths from `src/` when possible

### Type Errors
1. Check `src/types/index.ts` for available types
2. Import types with: `import type { TypeName } from '@types'`
3. Use strict type annotations for props

### Navigation Errors
1. Verify screen name matches `RootStackParamList`
2. Use `useNavigation<NavigationProp>()` hook with proper typing
3. Check that screen is registered in `RootNavigator`

## Best Practices

1. **Reusable Components**: Create in `src/components/` and import with path aliases
2. **Constants**: Define tokens in `src/constants/theme.ts` 
3. **Types**: Always create proper TypeScript interfaces
4. **Navigation**: Use `useNavigation()` hook with proper typing
5. **Styling**: Use centered token-based design system
6. **Code Format**: Run prettier before committing

## Resources

- Expo Docs: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- React Native: https://reactnative.dev
- TypeScript: https://www.typescriptlang.org



npx -y @gethopp/figma-mcp-bridge