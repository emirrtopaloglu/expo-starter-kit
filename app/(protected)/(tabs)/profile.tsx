import React, { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { ListItem } from '@/components/ui/ListItem';
import { haptics } from '@/utils/haptics';
import { toast } from '@/utils/toast';
import { secureStorage } from '@/utils/secureStorage';
import {
  User,
  Sparkles,
  HelpCircle,
  LogOut,
  Trash2,
  Globe,
  Moon,
  Bell,
  Shield,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { theme, themePreference, setThemePreference } = useTheme();
  const { user, logout } = useStore();
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleLanguageChange = (lang: string) => {
    haptics.selection();
    i18n.changeLanguage(lang);
  };

  const handleRestore = async () => {
    setIsSyncing(true);
    haptics.impact();

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      haptics.notification(haptics.Notification.Success);
      toast.success(
        t('protected.paywall.restoreSuccessTitle'),
        t('protected.paywall.restoreSuccessMessage')
      );
    } catch {
      haptics.notification(haptics.Notification.Error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    haptics.notification(haptics.Notification.Warning);
    await logout();
    toast.success(t('protected.home.logoutSuccessTitle'), t('protected.home.logoutSuccessMessage'));
  };

  const handleDeleteAccount = () => {
    haptics.notification(haptics.Notification.Error);
    Alert.alert(t('protected.settings.deleteTitle'), t('protected.settings.deleteMessage'), [
      { text: t('protected.settings.deleteCancel'), style: 'cancel' },
      {
        text: t('protected.settings.deleteConfirm'),
        style: 'destructive',
        onPress: async () => {
          setIsSyncing(true);
          try {
            await secureStorage.removeItem('vault_login_credentials');
            await logout();
            toast.success(
              t('protected.settings.deleteSuccessTitle'),
              t('protected.settings.deleteSuccessMessage')
            );
          } catch {
            toast.error(t('protected.settings.deleteTitle'), 'Failed to erase account.');
          } finally {
            setIsSyncing(false);
          }
        },
      },
    ]);
  };

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={['top']}
      backgroundColor={theme.colors.background.default}
      contentContainerStyle={{ paddingBottom: 110 }}
    >
      <Box p="md">
        <VStack space="lg">
          {/* Title Header */}
          <Typography variant="h2" style={{ fontWeight: '800' }}>
            {t('protected.settings.title')}
          </Typography>

          {/* Profile Card */}
          <Card>
            <HStack space="md" align="center">
              <Box bg={theme.colors.primary} p="md" rounded="full">
                <User color="white" size={24} />
              </Box>
              <VStack space="xs" style={{ flex: 1 }}>
                <Typography variant="body" style={{ fontWeight: '700' }}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color={theme.colors.text.subtle}>
                  {user?.email}
                </Typography>
              </VStack>
              <Button
                label={t('protected.home.viewAll')}
                size="sm"
                variant="ghost"
                onPress={() => router.push('/paywall')}
                leftIcon={<Sparkles size={16} color={theme.colors.primary} />}
              />
            </HStack>
          </Card>

          {/* Settings Groups */}
          <VStack space="md">
            {/* Preferences Group */}
            <Typography
              variant="caption"
              style={{ fontWeight: '700', paddingLeft: 4 }}
              color={theme.colors.text.subtle}
            >
              {t('protected.settings.sectionPreferences').toUpperCase()}
            </Typography>

            <Card padding="none">
              <VStack>
                {/* Dark Mode Switch */}
                <ListItem
                  title={t('protected.settings.themeLabel')}
                  leftIcon={<Moon size={20} color={theme.colors.text.default} />}
                  onPress={() => {
                    haptics.selection();
                    setThemePreference(themePreference === 'dark' ? 'light' : 'dark');
                  }}
                  rightIcon={
                    <Switch
                      value={themePreference === 'dark'}
                      onValueChange={(val) => {
                        haptics.selection();
                        setThemePreference(val ? 'dark' : 'light');
                      }}
                    />
                  }
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border.default,
                  }}
                />

                {/* Notifications Switch */}
                <ListItem
                  title={t('protected.settings.notificationsLabel')}
                  leftIcon={<Bell size={20} color={theme.colors.text.default} />}
                  onPress={() => {
                    haptics.selection();
                    setNotificationsEnabled(!notificationsEnabled);
                  }}
                  rightIcon={
                    <Switch
                      value={notificationsEnabled}
                      onValueChange={(val) => {
                        haptics.selection();
                        setNotificationsEnabled(val);
                      }}
                    />
                  }
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border.default,
                  }}
                />

                {/* Language Switcher */}
                <ListItem
                  title={t('protected.settings.languageLabel')}
                  leftIcon={<Globe size={20} color={theme.colors.text.default} />}
                  rightIcon={
                    <HStack space="xs">
                      <Button
                        label="EN"
                        size="sm"
                        variant={i18n.language === 'en' ? 'solid' : 'outline'}
                        onPress={() => handleLanguageChange('en')}
                        style={{ width: 50, height: 32 }}
                      />
                      <Button
                        label="TR"
                        size="sm"
                        variant={i18n.language === 'tr' ? 'solid' : 'outline'}
                        onPress={() => handleLanguageChange('tr')}
                        style={{ width: 50, height: 32 }}
                      />
                    </HStack>
                  }
                />
              </VStack>
            </Card>

            {/* About & Support Group */}
            <Typography
              variant="caption"
              style={{ fontWeight: '700', paddingLeft: 4 }}
              color={theme.colors.text.subtle}
            >
              {t('protected.settings.sectionMore').toUpperCase()}
            </Typography>

            <Card padding="none">
              <VStack>
                {/* Support Form Link */}
                <Link href="/support" asChild>
                  <ListItem
                    title={t('protected.support.title')}
                    leftIcon={<HelpCircle size={20} color={theme.colors.text.default} />}
                    showChevron
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border.default,
                    }}
                  />
                </Link>

                {/* Restore Subscriptions */}
                <ListItem
                  title={t('protected.settings.restoreLabel')}
                  leftIcon={<Shield size={20} color={theme.colors.text.default} />}
                  showChevron
                  onPress={handleRestore}
                />
              </VStack>
            </Card>

            {/* Logout & Delete CTAs */}
            <VStack space="sm" style={{ marginTop: 8 }}>
              <Button
                label={t('protected.settings.logoutLabel')}
                onPress={handleLogout}
                disabled={isSyncing}
                variant="outline"
                leftIcon={<LogOut size={20} color={theme.colors.error.main} />}
                style={{ borderColor: theme.colors.error.main }}
                textColor={theme.colors.error.main}
              />

              <Button
                label={t('protected.settings.deleteAccountLabel')}
                onPress={handleDeleteAccount}
                disabled={isSyncing}
                variant="ghost"
                leftIcon={<Trash2 size={20} color={theme.colors.error.main} />}
                textColor={theme.colors.error.main}
              />
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </Screen>
  );
}
