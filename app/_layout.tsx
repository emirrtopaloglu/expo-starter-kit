import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/ui/ToastConfig';
import '@/i18n'; // Initialize i18n
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Re-export ErrorBoundary for Expo Router to catch layout-level errors
export { GlobalErrorBoundary as ErrorBoundary } from '@/components/GlobalErrorBoundary';

function RootLayoutNav() {
  const { theme } = useTheme();

  return (
    <NavigationThemeProvider value={theme.mode === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
      </Stack>
    </NavigationThemeProvider>
  );
}

/**
 * RootLayout component.
 * This is the main layout for the application.
 * It uses a Stack navigator to manage screen transitions.
 *
 * Documentation: https://docs.expo.dev/router/layouts/
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalErrorBoundary>
          <RootLayoutNav />
        </GlobalErrorBoundary>
        <Toast config={toastConfig} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
