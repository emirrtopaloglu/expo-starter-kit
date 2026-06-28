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
import { User, Mail, Lock } from 'lucide-react-native';
import { toast } from '@/utils/toast';
import { haptics } from '@/utils/haptics';
import { Image } from 'react-native';
import { useStore } from '@/store';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const registerGlobal = useStore((state) => state.register);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error(t('auth.login.validationErrorTitle'), t('auth.login.validationErrorMessage'));
      return;
    }

    if (password.length < 6) {
      toast.error(t('auth.register.errorTitle'), t('auth.register.passwordPlaceholder'));
      return;
    }

    setIsSubmitting(true);
    haptics.impact();

    try {
      // Trigger register action from store (which abstracts Supabase vs Custom backend)
      await registerGlobal(email, password, name);

      haptics.notification(haptics.Notification.Success);
      toast.success(t('auth.register.successTitle'), t('auth.register.successMessage'));

      // Navigate to login
      router.replace('/login');
    } catch (err: any) {
      haptics.notification(haptics.Notification.Error);
      toast.error(t('auth.register.errorTitle'), err.message || 'Something went wrong.');
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
              {t('auth.register.title')}
            </Typography>
            <Typography variant="body" color={theme.colors.text.subtle} align="center">
              {t('auth.register.subtitle')}
            </Typography>
          </Box>

          {/* Form Card */}
          <Card>
            <VStack space="md">
              <Input
                label={t('auth.register.nameLabel')}
                value={name}
                onChangeText={setName}
                placeholder={t('auth.register.namePlaceholder')}
                autoCapitalize="words"
                leftIcon={<User size={20} color={theme.colors.text.subtle} />}
              />

              <Input
                label={t('auth.register.emailLabel')}
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.register.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color={theme.colors.text.subtle} />}
              />

              <Input
                label={t('auth.register.passwordLabel')}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.register.passwordPlaceholder')}
                secureTextEntry
                autoCapitalize="none"
                leftIcon={<Lock size={20} color={theme.colors.text.subtle} />}
              />

              <Button
                label={t('auth.register.signUp')}
                onPress={handleRegister}
                isLoading={isSubmitting}
                style={{ marginTop: 8 }}
              />

              <Link href="/login" asChild>
                <Button
                  label={t('auth.register.alreadyHaveAccount')}
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
