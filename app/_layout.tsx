import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/ui/ToastConfig';
import '@/i18n'; // Initialize i18n
import '@/api/services/authService'; // Registers token refresh handler for custom mode
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary';
import { NetworkBanner } from '@/components/NetworkBanner';
import { AppUpdateBanner } from '@/components/AppUpdateBanner';

import { useStore } from '@/store';
import { queryClient } from '@/api/queryClient';
import { revenueCat } from '@/utils/revenueCat';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Re-export ErrorBoundary for Expo Router to catch layout-level errors
export { GlobalErrorBoundary as ErrorBoundary } from '@/components/GlobalErrorBoundary';

function RootLayoutNav() {
  const { theme } = useTheme();
  const { isAuthenticated, isAuthLoading, hasCompletedOnboarding } = useStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';
    const isOnboarding = segments[0] === 'onboarding';

    if (!hasCompletedOnboarding) {
      if (!isOnboarding) {
        // Force redirect to onboarding if not completed
        router.replace('/onboarding');
      }
    } else if (!isAuthenticated) {
      if (!inAuthGroup) {
        // Redirect to login if not authenticated
        router.replace('/login');
      }
    } else {
      // Authenticated and onboarding complete
      if (inAuthGroup || isOnboarding || !segments[0]) {
        // Send to protected root
        router.replace('/');
      }
    }
  }, [isAuthenticated, isAuthLoading, hasCompletedOnboarding, segments]);

  return (
    <NavigationThemeProvider value={theme.mode === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(protected)" />
        <Stack.Screen name="(auth)" />
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
  const initializeAuth = useStore((state) => state.initializeAuth);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    // Set premium listener callback to update Zustand store state
    // and break circular dependencies
    revenueCat.setPremiumListener((isPremium) => {
      useStore.getState().setPremium(isPremium);
    });

    // pre-emptively load credentials from secure storage
    initializeAuth();
    // Initialize RevenueCat SDK
    revenueCat.initialize();
  }, [initializeAuth]);

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
        <AppUpdateBanner />
        <NetworkBanner />
        <Toast config={toastConfig} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
