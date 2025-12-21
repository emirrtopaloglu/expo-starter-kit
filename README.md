# Expo Starter Kit

This is a comprehensive starter kit for Universal React Native applications built with **Expo**. It is designed to serve as a solid foundation for your projects, with **Expo Router** pre-configured and ready to use.

## Features

- **Expo Router**: File-based routing for React Native and web.
- **TypeScript**: Statically typed code for better maintainability.
- **Absolute Paths**: Cleaner imports using the `@/` alias (e.g., `@/components/Test`).
- **Lucide Icons**: Beautiful & consistent icons via `lucide-react-native`.
- **State Management**: Simple and fast state management with **Zustand**.
- **Splash Screen**: Configured with `expo-splash-screen` for smooth startup and manual control.
- **UI Feedback**: Built-in support for **Haptics** and custom **Toast Notifications** (styled like react-hot-toast).
- **Code Quality**: Pre-configured with **ESLint**, **Prettier**, **Husky**, and **Lint-staged** for robust coding standards.
- **Storage Utilities**: Abstracted `AsyncStorage` and `Expo SecureStore` wrappers for data persistence.
- **Forms & Validation**: Built with **React Hook Form** and **Zod** schema validation.
- **Dark Mode**: System-aware dark mode with persistence using **AsyncStorage**.
- **Internationalization (i18n)**: Multi-language support with **i18next**, including auto-detection and persistence.
- **Data Fetching**: Powerful asynchronous state management with **TanStack React Query** and **Axios**.
- **High Performance Lists**: Fast & efficient lists using **FlashList**.
- **Organized Structure**: Robust folder structure including `components/ui`, `hooks`, `constants`, and `utils`.
- **Expo**: A framework for universal React applications.
- **Scalable Structure**: Designed to support additional features and integrations.
- **Modules & Permissions**: Centralized `PermissionManager` for consistent Camera, Gallery, Location, and Notification access.
- **Global Error Boundary**: Catches unhandled errors and displays a user-friendly crash screen with restart functionality.
- **Design System**: A comprehensive suite of 30+ reusable UI components located in `@/components/ui`.

## Components Available

### Layout & primitives

- **Box**: Low-level layout primitive with spacing and border props.
- **Stack (HStack/VStack)**: Flexbox wrappers for easy row/column layouts.
- **Screen**: Safe-area aware screen wrapper with scroll presets.
- **Divider**: Visual separator with optional text label.
- **Card**: Container with shadow and border variants.
- **MasonryList**: Pinterest-style 2-column staggered grid.
- **Skeleton**: Loading placeholder animations.

### Typography

- **Typography**: Text component with standardized presets (h1-h4, body, caption).

### Forms & Input

- **Button**: Customizable buttons with variants (solid, outline, ghost) and loading states.
- **Input**: Stylized text inputs with icon support.
- **Select**: BottomSheet-based select with search and multi-select support.
- **DatePicker**: Robust Date picker with confirm-flow and consistent styling.
- **Checkbox/Radio/Switch**: Native-feeling toggle controls.
- **Slider**: Range slider with custom track and thumb.
- **Switch**: Toggle switch component.
- **OTPInput**: segmented input for One-Time Passwords.
- **FormController**: Wrapper for easy `react-hook-form` integration.
- **SegmentedControl**: iOS-style segmented toggle.
- **SearchBar**: Dedicated search input with clear action.
- **Stepper**: Number input with increment/decrement buttons.

### Navigation & Feedback

- **Tabs**: Custom tab bar or segment switcher.
- **Avatar**: Image or text avatars with fallback support.
- **Badge**: Status indicators and notification counts.
- **Image**: High-performance cached image with blurhash/transition support (uses `expo-image`).
- **ProgressBar**: Visual progress indicator.
- **Spinner**: Loading spinner.
- **FAB**: Floating Action Button.
- **EmptyState**: Placeholder for empty lists or data.
- **ErrorState**: Placeholder for error states with retry action.

### Overlays

- **Modal**: Center-aligned modal dialogs.
- **BottomSheet**: Draggable bottom sheet/drawer.
- **Accordion**: Collapsible content sections.
- **Toast**: (Config via `ToastConfig.tsx` and `react-hot-toast-native`).

### Utilities & Native Hooks

- **PermissionManager**: Unified API for handling generic permissions (Camera, Location, Notifications).
- **useRunPermission**: Hook to wrap functions with automatic permission requesting and settings-redirection flow.
- **SystemPickers**: Helper examples for `expo-document-picker` and `expo-image-picker`.
- **CameraView**: Custom Camera screen implementation using `expo-camera` with flash and flip controls.
- **GlobalErrorBoundary**: Class component that wraps the app to catch potential crashes and show a fallback UI (`CrashScreen`).

## 🎨 Custom Fonts

The project comes pre-configured with **Plus Jakarta Sans** from Google Fonts.

**How to change the font:**

1.  Install a new font package (search for `@expo-google-fonts/[font-name]`).
    ```bash
    npx expo install @expo-google-fonts/roboto expo-font
    ```
2.  Update `app/_layout.tsx`:
    - Import the new font variants.
    - Add them to the `useFonts` hook configuration.
3.  Update `theme/tokens/typography.ts`:
    - Change the `fontFamily` property in `variants` to match your new font (e.g., `'Roboto_400Regular'`).

The `Typography` component will automatically pick up these changes via the theme.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

## Project Structure

- `app/`: Contains the routes for your application.
  - `app/_layout.tsx`: The root layout file (Stack Navigator).
  - `app/index.tsx`: The entry screen (Home).
  - `app/details.tsx`: An example detail screen.
- `assets/`: Contains images and other static assets.

## Documentation

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Expo Documentation](https://docs.expo.dev/)

## License

This project is open source and available under the [MIT License](LICENSE).
