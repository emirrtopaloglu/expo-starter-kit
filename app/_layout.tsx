import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/ui/ToastConfig';
import '@/i18n'; // Initialize i18n

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { activeTheme } = useTheme();

  return (
    <NavigationThemeProvider value={activeTheme === 'dark' ? DarkTheme : DefaultTheme}>
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
  useEffect(() => {
    // Artificial delay for debugging splash screen (3 seconds)
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
        <Toast config={toastConfig} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
