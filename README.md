# 🚀 Expo Starter Kit (SDK 54)

A premium, universal React Native boilerplate designed for rapid development. This starter kit combines industry best practices, robust architecture, and a custom-designed atomic layout system to serve as a solid foundation for cross-platform iOS, Android, and Web applications.

---

## ✨ Features & Architecture

- **📱 Expo SDK 54 & Router v6**: Modern file-based routing with deep linking, modal sheets, and nested protected layouts.
- **🎨 Glassmorphic Floating Tab Bar**: A premium, system-aware bottom navigation bar featuring frosted glass translucencies and custom Lucide icons.
- **💳 RevenueCat Purchases**: Out-of-the-box support for App Store/Google Play subscriptions, featuring secure checkouts, purchase restorations, and offline/simulator sandbox fallbacks.
- **🔔 Push Notifications Utility**: A clean, centralized helper to register Expo Push Tokens, manage native Android notification channels, and handle foreground/tap response listeners.
- **🌐 Internationalization (i18n)**: Pre-configured multi-language system (`react-i18next`) with automatic language detection (`expo-localization`) and storage persistence.
- **📦 State & Networking**: Atomized state management using **Zustand** combined with **TanStack React Query v5** for network data fetching, caching, and state synchronization.
- **⚡ High-Performance Lists**: Built-in **FlashList** configuration for fluid 60fps lists on lower-end devices.
- **🛡️ Permission Manager**: Centralized permissions client (`Camera`, `Gallery`, `Location`, `Notifications`, `Audio`) with system settings redirection flows.
- **🚨 Error Boundaries**: A global exception handler displaying a beautiful custom crash screen, letting users reboot the app without losing store states.

---

## 📂 Project Directory Structure

```
.
├── api/                  # TanStack Query configurations & Axios network clients
├── app/                  # Expo Router directory (screens and layouts)
│   ├── (auth)/           # Authentication flows (Login, Register, Reset Password)
│   ├── (protected)/      # Authenticated views (Paywall, Support, Detail view)
│   │   └── (tabs)/       # Floating Glass Tab Bar (Home, Settings/Profile)
│   └── onboarding.tsx    # Swipeable page onboarding deck
├── assets/               # Static resources (icons, splash, Inter Google fonts)
├── components/           # General components and atomic design primitive UI units
├── hooks/                # Custom hooks (Permissions, Stopwatches, Async loaders)
├── i18n/                 # Translation locales (en.json, tr.json)
├── store/                # Persistent global Zustand store slices
├── theme/                # Theme context provider, token definitions, stylesheet hooks
└── utils/                # Native helpers (Secure storage, Haptics, Toast, RevenueCat)
```

---

## 🎨 Design System & UI Primitives

To maintain visual consistency and dark/light theme alignment, avoid raw `<View>` or `<Text>` components and utilize our atomic primitives in `components/ui/`:

### Primitives Table

| Primitive               | Inherits From    | Key Features / Purpose                                                    |
| :---------------------- | :--------------- | :------------------------------------------------------------------------ |
| **`Screen`**            | `<SafeAreaView>` | Scroll/fixed presets, keyboard offsets, status bar styling.               |
| **`Box`**               | `<View>`         | Layout wrapper with utility spacing, rounding, and shadow props.          |
| **`Stack`**             | `<View>`         | Grid/row layouts with gaps using the `space` prop.                        |
| **`HStack` / `VStack`** | `<View>`         | Horizontal and vertical stack extensions.                                 |
| **`Typography`**        | `<Text>`         | Handles fonts and sizes (`h1` to `caption` variants) mapped to **Inter**. |
| **`Button`**            | `<Pressable>`    | Variants (solid, outline, ghost), spinner overlays, and icon support.     |
| **`Card`**              | `<View>`         | Content container surfaces (`elevated`, `outlined`, `filled`).            |
| **`ListItem`**          | `<Pressable>`    | List row container with left/right icons, chevrons, and active overlays.  |
| **`Badge`**             | `<View>`         | Status pills (`solid`, `outline`, `subtle` variants).                     |

---

## 🔧 Environment Setup & Config

Copy `.env` variables and replace placeholders with your credentials:

```env
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_URL=https://api.example.com

# RevenueCat API Keys
EXPO_PUBLIC_REVENUECAT_APPLE_KEY=your_revenuecat_apple_api_key
EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY=your_revenuecat_google_api_key
EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID=premium
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Metro development server:

   ```bash
   npx expo start
   ```

3. Run on local platforms (Development Build):

   ```bash
   # For iOS Simulator
   npm run ios

   # For Android Emulator
   npm run android
   ```

---

## 📝 Code Standards & Linting

Maintain high type safety and formatting checks prior to commit:

- **Type Checker**: `npx tsc --noEmit`
- **Linter & Formatter**: `npm run lint` (runs ESLint and Prettier auto-fixes)

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
