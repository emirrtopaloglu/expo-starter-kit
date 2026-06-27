import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, MessageSquare } from 'lucide-react-native';
import { toast } from '@/utils/toast';
import { haptics } from '@/utils/haptics';

export default function SupportScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  const [category, setCategory] = useState<
    'bug' | 'feature' | 'billing' | 'account' | 'other' | ''
  >('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { key: 'bug', label: t('protected.support.catBug') },
    { key: 'feature', label: t('protected.support.catFeature') },
    { key: 'billing', label: t('protected.support.catBilling') },
    { key: 'account', label: t('protected.support.catAccount') },
    { key: 'other', label: t('protected.support.catOther') },
  ];

  const handleSubmit = async () => {
    if (!category || !message.trim()) {
      toast.error(
        t('protected.support.validationErrorTitle'),
        t('protected.support.validationErrorMessage')
      );
      return;
    }

    setIsSubmitting(true);
    haptics.impact();

    try {
      // Simulate API ticketing submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      haptics.notification(haptics.Notification.Success);
      toast.success(t('protected.support.successTitle'), t('protected.support.successMessage'));
      router.back();
    } catch {
      haptics.notification(haptics.Notification.Error);
      toast.error('Submission Failed', 'Failed to transmit support ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={['top']}
      backgroundColor={theme.colors.background.default}
      contentContainerStyle={{ padding: theme.spacing.md }}
    >
      {/* Header bar */}
      <HStack align="center" style={{ paddingHorizontal: theme.spacing.xs, height: 48 }}>
        <Button
          label=""
          variant="ghost"
          onPress={() => router.back()}
          leftIcon={<ArrowLeft size={22} color={theme.colors.text.default} />}
          style={{ width: 40, height: 40, padding: 0 }}
        />
        <Typography variant="body" style={{ fontWeight: '700', marginLeft: theme.spacing.xs }}>
          {t('protected.support.title')}
        </Typography>
      </HStack>

      <VStack space="lg" style={{ marginTop: theme.spacing.md }}>
        {/* Pitch */}
        <VStack space="xs">
          <Typography variant="h3" style={{ fontWeight: '800' }}>
            {t('protected.support.title')}
          </Typography>
          <Typography variant="bodySmall" color={theme.colors.text.subtle}>
            {t('protected.support.subtitle')}
          </Typography>
        </VStack>

        {/* Category selection */}
        <VStack space="xs">
          <Typography variant="bodySmall" style={{ fontWeight: '600', paddingLeft: 4 }}>
            {t('protected.support.categoryLabel')}
          </Typography>

          <HStack space="xs" style={{ flexWrap: 'wrap', gap: 6 }}>
            {categories.map((cat) => (
              <Button
                key={cat.key}
                label={cat.label}
                size="sm"
                variant={category === cat.key ? 'solid' : 'outline'}
                onPress={() => {
                  haptics.selection();
                  setCategory(cat.key as any);
                }}
                style={{
                  height: 36,
                  paddingHorizontal: 12,
                  marginBottom: 4,
                }}
              />
            ))}
          </HStack>
        </VStack>

        {/* Message input */}
        <VStack space="xs">
          <Typography variant="bodySmall" style={{ fontWeight: '600', paddingLeft: 4 }}>
            {t('protected.support.messageLabel')}
          </Typography>

          <Input
            value={message}
            onChangeText={setMessage}
            placeholder={t('protected.support.messagePlaceholder')}
            multiline
            numberOfLines={4}
            style={{
              height: 120,
              textAlignVertical: 'top',
              paddingTop: theme.spacing.sm,
            }}
          />
        </VStack>

        {/* Action button */}
        <Button
          label={t('protected.support.submit')}
          onPress={handleSubmit}
          isLoading={isSubmitting}
          leftIcon={<MessageSquare size={20} color="white" />}
          style={{ marginTop: 8 }}
        />
      </VStack>
    </Screen>
  );
}
