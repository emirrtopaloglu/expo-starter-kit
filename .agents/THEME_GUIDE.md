# Expo Starter Kit - Theme System Guide

This guide describes how the theme system is structured in the **Expo Starter Kit**, how to customize it for a new project (colors, fonts, borders, shadows), and the best practices for using theme tokens.

---

## 🎨 Theme Architecture Overview

The boilerplate uses a **System-Aware Light & Dark Mode** theme architecture. It combines design tokens (colors, spacing, typography, layouts) with React Context and a custom style hook to ensure styles update reactively when toggling light/dark modes or system settings.

### File Structure

All files related to themes are located in the `theme/` directory:

- [theme/index.ts](file:///Users/emirtopaloglu/www/expo-starter-kit/theme/index.ts): Combines raw tokens into concrete `lightTheme` and `darkTheme` objects.
- [theme/ThemeContext.tsx](file:///Users/emirtopaloglu/www/expo-starter-kit/theme/ThemeContext.tsx): Manages theme mode state (`light` | `dark` | `system`), handles AsyncStorage persistence, and provides the context provider.
- [theme/useThemedStyles.ts](file:///Users/emirtopaloglu/www/expo-starter-kit/theme/useThemedStyles.ts): Custom hook for component styling. It memoizes style sheets and automatically rebuilds them on theme changes.
- **theme/tokens/**: Directory containing raw design scales:
  - [colors.ts](file:///Users/emirtopaloglu/www/expo-starter-kit/theme/tokens/colors.ts): Color palettes (Primary scale, Grays, Semantic colors).
  - [layout.ts](file:///Users/emirtopaloglu/www/expo-starter-kit/theme/tokens/layout.ts): Border radius presets and iOS/Android shadow configuration objects.
  - [spacing.ts](file:///Users/emirtopaloglu/www/expo-starter-kit/theme/tokens/spacing.ts): Unified gap, padding, and margin spacing scale.
  - [typography.ts](file:///Users/emirtopaloglu/www/expo-starter-kit/theme/tokens/typography.ts): Font sizes, weights, custom fonts, and typographic text variants.

---

## 🚀 Customization Guide (How to Personalize your App)

When copying this boilerplate to start a new project, follow these steps to configure your own branding.

### 1. Customizing the Color Palette

Core color definitions are located in `theme/tokens/colors.ts`.

- **Primary Color**: Modify the `primary` object (shades 50 to 900) to match your brand's primary color.
- **Neutral Grays**: Modify the `neutral` gray scale to use slate, zinc, gray, or warm neutral tones.
- **Semantic Colors**: Modify the `success`, `error`, `warning`, and `info` objects.

```typescript
// theme/tokens/colors.ts
export const colors = {
  primary: {
    50: '#F0F9FF',
    // ... update shades 100 to 400
    500: '#0284C7', // New Blue Primary Color
    // ... update shades 600 to 900
  },
  // ...
};
```

> [!NOTE]
> `lightTheme` maps `theme.colors.primary` to `colors.primary[500]`, while `darkTheme` maps it to `colors.primary[400]` for better contrast on dark backgrounds.

---

### 2. Customizing the App Fonts

This boilerplate comes with Google Font **Plus Jakarta Sans** pre-configured. To replace it:

1. **Install your new font package**:
   Search for your desired font on [Expo Google Fonts](https://directory.edisons.dev/expo-google-fonts) and install it:

   ```bash
   npx expo install @expo-google-fonts/inter expo-font
   ```

2. **Load the font in `app/_layout.tsx`**:
   Import your font variants and register them in the `useFonts` hook:

   ```typescript
   // app/_layout.tsx
   import {
     useFonts,
     Inter_400Regular,
     Inter_500Medium,
     Inter_600SemiBold,
     Inter_700Bold,
   } from '@expo-google-fonts/inter';

   export default function RootLayout() {
     const [fontsLoaded] = useFonts({
       Inter_400Regular,
       Inter_500Medium,
       Inter_600SemiBold,
       Inter_700Bold,
     });
     // ...
   }
   ```

3. **Update Centralized Font Mappings**:
   Modify the `fonts` configuration inside `theme/tokens/typography.ts`. The rest of the app (including typographic variants and `Typography` components) will automatically update:
   ```typescript
   // theme/tokens/typography.ts
   const fonts = {
     regular: 'Inter_400Regular',
     medium: 'Inter_500Medium',
     semibold: 'Inter_600SemiBold',
     bold: 'Inter_700Bold',
   } as const;
   ```

---

### 3. Modifying Spacing & Border Radii

- **Border Radii**: Located in `theme/tokens/layout.ts`. Adjust `sm`, `md`, `lg`, and `xl` settings to choose between a sharp (smaller values) or organic/rounded (larger values) look.
- **Spacing Scale**: Located in `theme/tokens/spacing.ts`. Adjust the spacing system to fit your layout grid (e.g. 4-pt grid vs 8-pt grid).
- **Shadows**: Located in `theme/tokens/layout.ts`. Modify the shadow settings (`sm`, `md`, `lg`) to control shadow color, offset, and opacity.
  - iOS uses: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`.
  - Android uses: `elevation`.

---

## 💡 Best Practices for Using the Theme

### 1. Component Styling with `useThemedStyles`

Avoid writing inline styles or using `StyleSheet.create` statically if you need access to the theme parameters. Instead, use the custom hook:

```tsx
import { useThemedStyles } from '@/theme/useThemedStyles';
import { Theme } from '@/theme';

export default function StyledCard() {
  const styles = useThemedStyles(getStyles);
  return <View style={styles.card} />;
}

const getStyles = (theme: Theme) => ({
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    ...theme.shadows.md,
    borderColor: theme.colors.border.default,
    borderWidth: 1,
  },
});
```

### 2. Layouts with UI Primitives

Never use raw `<View>` or `<Text>` if you can achieve the layout using the boilerplate's primitive UI components in `components/ui/`:

- **`Box`**: Ideal for flex styling, background coloring, padding, margins, shadows, and borders using simple props.
- **`Stack` (HStack / VStack)**: Simplifies grid/flex layouts by adding configurable gaps (`space`) between items.
- **`Typography`**: Standardizes text rendering and applies correct font family weights dynamically.

```tsx
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';

export function UserProfileCard() {
  return (
    <Box bg="card" p="md" rounded="lg" shadow="sm">
      <HStack space="md" align="center">
        {/* Avatar */}
        <VStack space="xs">
          <Typography variant="h4" weight="bold">
            John Doe
          </Typography>
          <Typography variant="caption" color="subtle">
            Developer
          </Typography>
        </VStack>
      </HStack>
    </Box>
  );
}
```

---

## ⚠️ Potential Issues & Gotchas

1. **Semantic Colors in Dark Mode**:
   By default, the semantic states (`success`, `error`, `warning`, `info`) inherit the same light-mode color definitions inside `darkTheme`.
   _Caution_: Bright background shades like `success.light` (`#DCFCE7`) are too bright for dark surfaces. In dark mode, prefer using a translucent variant or custom dark shade for background fills (e.g. `rgba(34, 197, 94, 0.15)`).

2. **StatusBar & Safe Areas on Android**:
   The app configures `edgeToEdgeEnabled: true` in `app.json`. To prevent your layout from clipping under the status bar or hardware notch, wrap your layouts with the `Screen` component (using `preset="scroll"` or `preset="fixed"`) which handles safe areas correctly on both iOS and Android.

3. **Shadow Visibility in Dark Mode**:
   Standard shadows are barely visible on dark backgrounds. `theme/index.ts` handles this by overriding shadow opacities to higher values (e.g., `shadowOpacity: 0.4` for medium shadows in dark mode) to preserve depth. Make sure to use `theme.shadows` instead of importing `shadows` from `tokens` to benefit from this dark mode adaptation.
