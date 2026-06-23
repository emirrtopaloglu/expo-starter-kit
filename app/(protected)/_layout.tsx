import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useStore } from '@/store';
import { Spinner } from '@/components/ui/Spinner';
import { Box } from '@/components/ui/Box';
import { useTheme } from '@/theme/ThemeContext';

/**
 * ProtectedLayout: Guarded navigation layout.
 * Gated behind Zustand auth state check. If user is unauthenticated,
 * automatically redirects them to the /login screen.
 */
export default function ProtectedLayout() {
  const { isAuthenticated, isAuthLoading } = useStore();
  const { theme } = useTheme();

  if (isAuthLoading) {
    return (
      <Box
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background.default,
        }}
      >
        <Spinner size="large" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
