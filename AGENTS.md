# Developer Guidelines & Rules for Expo Starter Kit

This document establishes the architecture, coding standards, design system rules, and behavioral constraints for developers and AI agents working on the **Expo Starter Kit** project.

---

## 🚀 Tech Stack Overview

- **Core Framework**: React Native (0.81.x) with Expo (SDK 54)
- **Routing & Navigation**: Expo Router v6 (file-based navigation)
- **Language**: TypeScript (Strict Mode)
- **Styling**: React Native StyleSheet powered by custom theme tokens and `useThemedStyles` hook
- **State Management**: Zustand (Client-side) & TanStack React Query v5 (Server-side/Caching)
- **Networking**: Axios instance `@/api/client`
- **Localization**: i18next & react-i18next with auto-language detection (`expo-localization`)
- **Native Modules & Utilities**: `PermissionManager`, `haptics`, `toast`, and `secureStorage` wrappers

---

## 📂 Project Architecture

```
.
├── api/                  # Axios network client
│   └── client.ts         # Centralized HTTP request setup (baseURL via EXPO_PUBLIC_API_URL)
├── app/                  # Expo Router directory (screens and layouts)
│   ├── _layout.tsx       # Root layout provider config (QueryClient, Theme, i18n, Toast)
│   ├── index.tsx         # Home screen
│   ├── list.tsx          # High-performance list example
│   ├── form.tsx          # Form validation example
│   └── design-system/    # Kitchen sink demonstrating all custom UI components
├── assets/               # Static resources (icons, splash, fonts)
├── components/           # General app-wide components
│   ├── ui/               # 30+ reusable atomic UI primitives (design system components)
│   ├── GlobalErrorBoundary.tsx
│   └── ThemeToggle.tsx
├── constants/            # Global configuration and storage keys
├── hooks/                # Custom React Native hooks (e.g. useRunPermission)
├── i18n/                 # Localization configurations and translation files
│   ├── index.ts
│   └── locales/          # JSON translation tables (en.json, tr.json)
├── store/                # Zustand global stores
├── theme/                # Theme system context, tokens, and hooks
│   ├── tokens/           # colors, layout (radius/shadows), spacing, typography
│   ├── ThemeContext.tsx  # Light/Dark mode state and preference persistence
│   └── useThemedStyles.ts # Dynamic StyleSheet helper mapping style functions to current theme
└── utils/                # Centralized utilities (haptics, storage, toast, permissions)
```

---

## 🎨 Styling & Theming Guidelines

### 1. Style Mapping & Theme Context

- The app supports a dynamic **System-Aware Light & Dark Mode** via `useTheme` in `@/theme/ThemeContext`.
- **Never hardcode hex colors or layout properties** (padding, margin, border-radius). Use values defined in `theme.colors`, `theme.spacing`, `theme.radius`, or `theme.shadows`.
- For component-specific styles, use the **`useThemedStyles`** hook. Avoid manual inline stylesheets where theme variables are required.

#### Example Usage:

```tsx
import { useThemedStyles } from '@/theme/useThemedStyles';
import { Theme } from '@/theme';

export default function MyComponent() {
  const styles = useThemedStyles(getStyles);
  // Render layout using styles...
}

const getStyles = (theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background.default,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    ...theme.shadows.sm,
  },
  text: {
    color: theme.colors.text.default,
    fontSize: theme.typography.sizes.md,
  },
});
```

### 2. Layout & UI Primitives

Always prefer using the high-level custom components in `@/components/ui/` instead of raw React Native components:

- Use **`Box`** instead of `<View>` for block layout with utility props (`p`, `m`, `bg`, `rounded`, `shadow`).
- Use **`Stack`**, **`VStack`**, or **`HStack`** for flex layouts with configurable `space` gaps.
- Use **`Typography`** instead of `<Text>`. Pass the `variant` prop (`h1`, `h2`, `h3`, `h4`, `body`, `bodySmall`, `caption`) to style typography text.
- Use **`Button`** instead of raw `<Pressable>` or `<Button>` to automatically inherit presets, loading indicator wrappers, and icons.
- Use **`Screen`** as a root layout wrapper to handle Safe Area contexts and scroll views.

---

## 🛡️ Native Modules & Utilities

### 1. Centralized Permissions Management

Do not call raw `expo-camera`, `expo-location`, or similar modules directly for permissions. Use **`PermissionManager`** (`@/utils/PermissionManager`) or the **`useRunPermission`** hook (`@/hooks/useRunPermission`).

- **Supported permission types**: `'camera' | 'gallery' | 'locationForeground' | 'notifications' | 'audio'`
- **App Configuration**: Remember to update the plugin permissions block in `app.json` for Android and iOS builds whenever a new permission type is added to the app.

#### Example:

```tsx
import { useRunPermission } from '@/hooks/useRunPermission';

const takePhotoAction = useRunPermission('camera', () => {
  // Executes only if permission is granted.
  // Otherwise, automatically asks or redirects user to system settings.
  openCamera();
});
```

### 2. Haptics & Feedback

Always trigger appropriate haptic feedback during interactive events (e.g., button presses, toggles, success/error notifications) using the `haptics` utility (`@/utils/haptics`).

- `haptics.selection()` - For simple item selections or tabs.
- `haptics.impactLight()` / `haptics.impactMedium()` / `haptics.impactHeavy()` - For button taps or actions.
- `haptics.notification(haptics.Notification.Success / Error / Warning)` - For operation feedback.

### 3. Toast Notifications

Use the centralized `toast` utility (`@/utils/toast`) for displaying feedback toast notifications instead of direct alert popups.

- `toast.success('Title', 'Message')`
- `toast.error('Title', 'Message')`

---

## 🌐 State & Localization

### 1. Client-side State (Zustand)

- Centralize client-side stores in `@/store/` (e.g., `useStore.ts`).
- Avoid bloated global stores; keep stores atomic, modular, and focused on specific domains.

### 2. Localization (i18n)

- **Do not hardcode UI strings.** All developer-facing UI text labels must use `t('key')` from `react-i18next`.
- Add all localization mappings in both `i18n/locales/en.json` and `i18n/locales/tr.json` to keep translation files synchronized.

---

## 🛠️ Coding Rules for AI Agents

When modifying or expanding this codebase, you must adhere strictly to these constraints:

1. **Type Safety**: Maintain strict TypeScript typing. Do not use `any` unless absolutely necessary and documented.
2. **Design Integrity**: Under no circumstances add Tailwind CSS or NativeWind. Custom styling is fully unified around the React Native theme tokens system and `useThemedStyles`.
3. **No Raw Elements**: Never create raw layouts using `<View>` and `<Text>` if `Box`, `Stack`, and `Typography` components can achieve the same layout.
4. **Documentation**: Maintain code comments. Update `README.md` if new key integrations are introduced. Keep layout-level error boundaries active.
5. **Localization Alignment**: Ensure any new UI features add translated keys under both `en.json` and `tr.json`.
6. **Path Resolution**: Always use the `@/*` absolute paths alias instead of long relative imports (e.g. use `import { Box } from '@/components/ui/Box'` instead of `../../components/ui/Box`).
