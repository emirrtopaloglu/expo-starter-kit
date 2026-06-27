import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { VStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { AlertCircle } from 'lucide-react-native';

/**
 * NotFoundScreen component.
 * This is the fallback route (app/+not-found.tsx) that Expo Router displays
 * when the user navigates to an unmatched route.
 *
 * Documentation: https://docs.expo.dev/router/reference/not-found-routes/
 */
export default function NotFoundScreen() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const handleBackHome = () => {
    router.replace('/');
  };

  return (
    <>
      {/* Configure header behavior for the unmatched screen */}
      <Stack.Screen options={{ title: t('notFound.title'), headerShown: true }} />

      <Screen preset="fixed" backgroundColor={theme.colors.background.default}>
        <Box
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: theme.spacing.xl,
          }}
        >
          <VStack space="2xl" align="center" style={{ width: '100%' }}>
            {/* Glowing Illustration Box */}
            <Box
              style={{
                width: 100,
                height: 100,
                borderRadius: theme.radius.xl,
                backgroundColor: isDark
                  ? theme.colors.background.paper
                  : theme.colors.background.subtle,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.colors.border.subtle,
                ...theme.shadows.md,
              }}
            >
              <AlertCircle size={48} color={theme.colors.primary} />
            </Box>

            {/* Content Text Block */}
            <VStack space="sm" align="center">
              <Typography variant="h2" align="center" style={{ fontWeight: '700' }}>
                {t('notFound.title')}
              </Typography>
              <Typography
                variant="body"
                color={theme.colors.text.subtle}
                align="center"
                style={{ paddingHorizontal: theme.spacing.md }}
              >
                {t('notFound.description')}
              </Typography>
            </VStack>

            {/* Back Button */}
            <Button
              label={t('notFound.backHome')}
              onPress={handleBackHome}
              isFullWidth
              style={{ marginTop: theme.spacing.lg }}
            />
          </VStack>
        </Box>
      </Screen>
    </>
  );
}
