import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useStore, User } from '@/store';
import { authService } from '@/api/services/authService';
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
import { Mail, Lock, Fingerprint, LogIn } from 'lucide-react-native';

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
      // 1. Fire API login
      const response = await authService.login(email, password);

      // 2. Save biometrics credential configuration if enabled
      if (enableBiometrics && biometricsAvailable) {
        await secureStorage.setItemSecured(
          VAULT_CREDENTIALS_KEY,
          JSON.stringify({ email, password })
        );
        setHasSavedCredentials(true);
      }

      // 3. Complete global store login
      await loginGlobal(
        response.accessToken,
        response.refreshToken,
        response.expiresIn,
        response.user as User
      );

      haptics.notification(haptics.Notification.Success);
      toast.success(t('auth.login.welcomeBackTitle'), t('auth.login.loginSuccess', { name: response.user.name }));
      
      // Navigate to protected root dashboard
      router.replace('/');
    } catch (error: any) {
      haptics.notification(haptics.Notification.Error);
      toast.error(t('auth.login.loginFailedTitle'), error.message || t('auth.login.incorrectCredentials'));
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

      // Trigger login API with decrypted credentials
      const response = await authService.login(savedEmail, savedPassword);

      await loginGlobal(
        response.accessToken,
        response.refreshToken,
        response.expiresIn,
        response.user as User
      );

      haptics.notification(haptics.Notification.Success);
      toast.success(t('auth.login.welcomeBackTitle'), t('auth.login.authSuccess', { name: response.user.name }));
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
            <Box
              bg={theme.colors.primary}
              p="md"
              rounded="full"
              style={{ marginBottom: theme.spacing.md }}
            >
              <Lock color="white" size={32} />
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
            </VStack>
          </Card>

          {/* Quick Demo Credentials */}
          <Card variant="filled" style={{ borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.border.default }}>
            <VStack space="xs" style={{ alignItems: 'center' }}>
              <Typography variant="caption" style={{ fontWeight: '700' }} color={theme.colors.primary}>
                {t('auth.login.demoTitle')}
              </Typography>
              <Typography variant="caption">{t('auth.login.demoEmail')}</Typography>
              <Typography variant="caption">{t('auth.login.demoPassword')}</Typography>
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
