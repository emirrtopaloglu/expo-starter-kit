import React, { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { VStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mail } from 'lucide-react-native';
import { toast } from '@/utils/toast';
import { haptics } from '@/utils/haptics';
import { Image } from 'react-native';
import { useStore } from '@/store';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const resetPasswordGlobal = useStore((state) => state.resetPassword);

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    if (!email) {
      toast.error(t('auth.login.validationErrorTitle'), t('auth.forgotPassword.emailPlaceholder'));
      return;
    }

    setIsSubmitting(true);
    haptics.impact();

    try {
      // Trigger reset password action from store (which abstracts Supabase vs Custom backend)
      await resetPasswordGlobal(email);

      haptics.notification(haptics.Notification.Success);
      toast.success(
        t('auth.forgotPassword.successTitle'),
        t('auth.forgotPassword.successMessage', { email })
      );

      // Navigate to login
      router.replace('/login');
    } catch (err: any) {
      haptics.notification(haptics.Notification.Error);
      toast.error(t('auth.forgotPassword.errorTitle'), err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen safeAreaEdges={['top', 'bottom']} backgroundColor={theme.colors.background.default}>
      <Box p="lg" style={{ flex: 1, justifyContent: 'center' }}>
        <VStack space="xl">
          {/* Header */}
          <Box style={{ alignItems: 'center' }}>
            <Image
              source={require('../../assets/icon.png')}
              style={{
                width: 80,
                height: 80,
                borderRadius: theme.radius.xl,
                marginBottom: theme.spacing.md,
              }}
              resizeMode="contain"
            />
            <Typography variant="h1" align="center" style={{ fontWeight: '800' }}>
              {t('auth.forgotPassword.title')}
            </Typography>
            <Typography variant="body" color={theme.colors.text.subtle} align="center">
              {t('auth.forgotPassword.subtitle')}
            </Typography>
          </Box>

          {/* Card */}
          <Card>
            <VStack space="md">
              <Input
                label={t('auth.forgotPassword.emailLabel')}
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color={theme.colors.text.subtle} />}
              />

              <Button
                label={t('auth.forgotPassword.submit')}
                onPress={handleReset}
                isLoading={isSubmitting}
                style={{ marginTop: 8 }}
              />

              <Link href="/login" asChild>
                <Button
                  label={t('auth.forgotPassword.backToLogin')}
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                />
              </Link>
            </VStack>
          </Card>
        </VStack>
      </Box>
    </Screen>
  );
}
