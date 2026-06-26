import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Link, Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store';
import { haptics } from '@/utils/haptics';
import { toast } from '@/utils/toast';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LogOut } from 'lucide-react-native';

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const { user, logout } = useStore();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    haptics.notification(haptics.Notification.Warning);
    await logout();
    toast.success(t('protected.home.logoutSuccessTitle'), t('protected.home.logoutSuccessMessage'));
  };

  return (
    <Screen safeAreaEdges={['top', 'bottom']} backgroundColor={theme.colors.background.default}>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />

      <Box p="md" style={{ flex: 1, justifyContent: 'center' }}>
        <VStack space="xl">
          {/* Header section with User Info */}
          <Box style={{ alignItems: 'center' }}>
            <Typography variant="h1" align="center" style={{ fontWeight: '800' }}>
              {t('protected.home.welcome')}
            </Typography>
            <Typography variant="h2" align="center" color={theme.colors.primary} style={{ fontWeight: '700' }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="bodySmall" color={theme.colors.text.subtle} align="center" style={{ marginTop: 4 }}>
              {t('protected.home.loggedInAs', { email: user?.email })}
            </Typography>
          </Box>

          {/* Navigation Links Card */}
          <Card>
            <Typography variant="h4" style={{ marginBottom: 12, fontWeight: '700' }}>
              {t('protected.home.exploreDemos')}
            </Typography>
            <VStack space="sm">
              <Link href="/list" asChild>
                <Button label={t('links.list', 'Go to Todo List (Zustand + FlashList)')} variant="outline" />
              </Link>
              <Link href="/form" asChild>
                <Button label={t('links.form', 'Go to Form Demo (React Hook Form + Zod)')} variant="outline" />
              </Link>
              <Link href="/design-system" asChild>
                <Button label={t('protected.home.viewDesignSystem')} variant="outline" />
              </Link>
            </VStack>
          </Card>

          {/* Language Switcher */}
          <Card variant="filled">
            <Typography variant="caption" align="center" style={{ marginBottom: 8, fontWeight: '600' }}>
              {t('language.current', { lang: i18n.language.toUpperCase() })}
            </Typography>
            <HStack space="md" justify="center">
              <Button
                label="EN"
                size="sm"
                variant={i18n.language === 'en' ? 'solid' : 'outline'}
                onPress={() => {
                  haptics.selection();
                  changeLanguage('en');
                }}
                style={{ width: 80 }}
              />
              <Button
                label="TR"
                size="sm"
                variant={i18n.language === 'tr' ? 'solid' : 'outline'}
                onPress={() => {
                  haptics.selection();
                  changeLanguage('tr');
                }}
                style={{ width: 80 }}
              />
            </HStack>
          </Card>

          {/* Toast test panel */}
          <HStack space="md" justify="center">
            <Button
              label={t('protected.home.successToastLabel')}
              size="sm"
              variant="ghost"
              onPress={() => {
                haptics.notification(haptics.Notification.Success);
                toast.success(t('protected.home.toastSuccessTitle'), t('protected.home.toastSuccessMessage'));
              }}
            />
            <Button
              label={t('protected.home.errorToastLabel')}
              size="sm"
              variant="ghost"
              onPress={() => {
                haptics.notification(haptics.Notification.Error);
                toast.error(t('protected.home.toastErrorTitle'), t('protected.home.toastErrorMessage'));
              }}
            />
          </HStack>

          {/* Logout Button */}
          <Button
            label={t('protected.home.logout')}
            leftIcon={<LogOut size={20} color="white" />}
            onPress={handleLogout}
            style={{ backgroundColor: theme.colors.error.main }}
          />
        </VStack>
      </Box>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </Screen>
  );
}
