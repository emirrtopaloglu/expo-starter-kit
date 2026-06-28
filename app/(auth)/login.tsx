import React, { useState, useEffect } from 'react';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store';
import { secureStorage } from '@/utils/secureStorage';
import { biometrics } from '@/utils/biometrics';
import { toast } from '@/utils/toast';
import { haptics } from '@/utils/haptics';
import { useTheme } from '@/theme/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Mail, Lock, Fingerprint, LogIn } from 'lucide-react-native';
import { Image } from 'react-native';

const VAULT_CREDENTIALS_KEY = 'vault_login_credentials';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const loginGlobal = useStore((state) => state.login);

  // Form states
  const [email, setEmail] = useState('admin@starter.kit');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableBiometrics, setEnableBiometrics] = useState(false);

  // Biometrics availability states
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false);

  // Check biometrics and saved credentials on mount
  useEffect(() => {
    async function checkBiometrics() {
      const supported = await biometrics.isSupported();
      setBiometricsAvailable(supported);

      // Check if credentials exist in SecureStore without triggering prompt
      const saved = await secureStorage.getItem(VAULT_CREDENTIALS_KEY);
      setHasSavedCredentials(!!saved);
    }
    checkBiometrics();
  }, []);

  const handleStandardLogin = async () => {
    if (!email || !password) {
      toast.error(t('auth.login.validationErrorTitle'), t('auth.login.validationErrorMessage'));
      return;
    }

    setIsSubmitting(true);
    haptics.impact();

    try {
      // 1. Call loginGlobal (which calls Supabase signInWithPassword)
      await loginGlobal(email, password);

      // 2. Save biometrics credential configuration if enabled
      if (enableBiometrics && biometricsAvailable) {
        await secureStorage.setItemSecured(
          VAULT_CREDENTIALS_KEY,
          JSON.stringify({ email, password })
        );
        setHasSavedCredentials(true);
      }

      haptics.notification(haptics.Notification.Success);
      toast.success(
        t('auth.login.welcomeBackTitle'),
        t('auth.login.loginSuccess', { name: email.split('@')[0] })
      );

      // Navigate to protected root dashboard
      router.replace('/');
    } catch (error: any) {
      haptics.notification(haptics.Notification.Error);
      toast.error(
        t('auth.login.loginFailedTitle'),
        error.message || t('auth.login.incorrectCredentials')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricLogin = async () => {
    haptics.impact();
    toast.info(t('auth.login.biometricsPromptTitle'), t('auth.login.biometricsScanMessage'));

    try {
      // Retrieve stored login payload biometrically
      const credentialsStr = await secureStorage.getItemSecured(
        VAULT_CREDENTIALS_KEY,
        t('auth.login.biometricsReason')
      );

      if (!credentialsStr) {
        toast.error(t('auth.login.biometricsFailedTitle'), t('auth.login.biometricsDenied'));
        return;
      }

      const { email: savedEmail, password: savedPassword } = JSON.parse(credentialsStr);

      setIsSubmitting(true);

      // Trigger login via Zustand store with decrypted credentials
      await loginGlobal(savedEmail, savedPassword);

      haptics.notification(haptics.Notification.Success);
      toast.success(
        t('auth.login.welcomeBackTitle'),
        t('auth.login.authSuccess', { name: savedEmail.split('@')[0] })
      );
      router.replace('/');
    } catch (err: any) {
      haptics.notification(haptics.Notification.Error);
      toast.error(t('auth.login.authErrorTitle'), err.message || t('auth.login.decryptionFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@starter.kit');
    setPassword('password123');
    haptics.selection();
  };

  return (
    <Screen safeAreaEdges={['top', 'bottom']} backgroundColor={theme.colors.background.default}>
      <Box p="lg" style={{ flex: 1, justifyContent: 'center' }}>
        <VStack space="xl">
          {/* Logo & Header */}
          <Box style={{ alignItems: 'center' }}>
            <Image
              source={require('../../assets/icon.png')}
              style={{
                width: 80,
                height: 80,
                borderRadius: theme.radius.xl,
                marginBottom: theme.spacing.xs,
              }}
              resizeMode="contain"
            />

            {/* Active Provider Badge */}
            <Box style={{ marginBottom: theme.spacing.md }}>
              <Badge
                label={
                  process.env.EXPO_PUBLIC_AUTH_PROVIDER === 'supabase'
                    ? 'Supabase Auth Active'
                    : 'Custom Backend Active'
                }
                variant="subtle"
                colorScheme="primary"
              />
            </Box>

            <Typography variant="h1" align="center" style={{ fontWeight: '800' }}>
              {t('auth.login.title')}
            </Typography>
            <Typography variant="body" color={theme.colors.text.subtle} align="center">
              {t('auth.login.subtitle')}
            </Typography>
          </Box>

          {/* Login Card */}
          <Card>
            <VStack space="md">
              <Input
                label={t('auth.login.emailLabel')}
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.login.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color={theme.colors.text.subtle} />}
              />

              <Input
                label={t('auth.login.passwordLabel')}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.login.passwordPlaceholder')}
                secureTextEntry
                autoCapitalize="none"
                leftIcon={<Lock size={20} color={theme.colors.text.subtle} />}
              />

              {biometricsAvailable && (
                <HStack align="center" justify="space-between" style={{ paddingVertical: 4 }}>
                  <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                    {t('auth.login.enableBiometrics')}
                  </Typography>
                  <Switch value={enableBiometrics} onValueChange={setEnableBiometrics} />
                </HStack>
              )}

              <Button
                label={t('auth.login.signIn')}
                onPress={handleStandardLogin}
                isLoading={isSubmitting}
                leftIcon={<LogIn size={20} color="white" />}
                style={{ marginTop: 8 }}
              />

              {biometricsAvailable && hasSavedCredentials && (
                <Button
                  label={t('auth.login.signInBiometrics')}
                  variant="outline"
                  onPress={handleBiometricLogin}
                  disabled={isSubmitting}
                  leftIcon={<Fingerprint size={20} color={theme.colors.primary} />}
                />
              )}

              <HStack justify="space-between" style={{ marginTop: 8 }}>
                <Link href="/forgot-password" asChild>
                  <Button label={t('auth.forgotPassword.title')} variant="ghost" size="sm" />
                </Link>
                <Link href="/register" asChild>
                  <Button label={t('auth.register.signUp')} variant="ghost" size="sm" />
                </Link>
              </HStack>
            </VStack>
          </Card>

          {/* Quick Demo Credentials */}
          <Card
            variant="filled"
            style={{
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: theme.colors.border.default,
            }}
          >
            <VStack space="xs" style={{ alignItems: 'center' }}>
              <Typography
                variant="caption"
                style={{ fontWeight: '700' }}
                color={theme.colors.primary}
              >
                {t('auth.login.demoTitle')}
              </Typography>
              {process.env.EXPO_PUBLIC_AUTH_PROVIDER === 'supabase' ? (
                <Typography
                  variant="caption"
                  align="center"
                  style={{ paddingHorizontal: theme.spacing.sm }}
                >
                  {t('auth.login.supabaseDemoHelp') ||
                    'Authenticate using credentials from your Supabase auth instance.'}
                </Typography>
              ) : (
                <>
                  <Typography variant="caption">{t('auth.login.demoEmail')}</Typography>
                  <Typography variant="caption">{t('auth.login.demoPassword')}</Typography>
                </>
              )}
              <Button
                label={t('auth.login.autofillDemo')}
                size="sm"
                variant="ghost"
                onPress={handleQuickFill}
                style={{ marginTop: 4 }}
              />
            </VStack>
          </Card>
        </VStack>
      </Box>
    </Screen>
  );
}
