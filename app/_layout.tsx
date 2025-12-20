import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/ui/ToastConfig';
import '@/i18n'; // Initialize i18n

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
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
        <Toast config={toastConfig} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
