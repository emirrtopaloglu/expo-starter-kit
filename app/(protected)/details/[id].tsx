import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/utils/format';
import { useShare } from '@/hooks';
import { ArrowLeft, Share2, Calendar, User } from 'lucide-react-native';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  const { shareText } = useShare();

  const mockDate = new Date();
  const mockAuthor = id === '101' ? 'System' : id === '102' ? 'AuthManager' : 'StorageEngine';

  const handleShare = () => {
    shareText(
      `Developer Feed Update #${id}: Loaded successfully in Expo Starter Kit!`,
      `Share Update #${id}`
    );
  };

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={['top']}
      backgroundColor={theme.colors.background.default}
      contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
    >
      {/* Header bar */}
      <HStack
        align="center"
        justify="space-between"
        style={{ paddingHorizontal: theme.spacing.md, height: 48 }}
      >
        <Button
          label=""
          variant="ghost"
          onPress={() => router.back()}
          leftIcon={<ArrowLeft size={22} color={theme.colors.text.default} />}
          style={{ width: 40, height: 40, padding: 0 }}
        />
        <Typography variant="body" style={{ fontWeight: '700' }}>
          {t('protected.details.title')}
        </Typography>
        <Button
          label=""
          variant="ghost"
          onPress={handleShare}
          leftIcon={<Share2 size={20} color={theme.colors.text.default} />}
          style={{ width: 40, height: 40, padding: 0 }}
        />
      </HStack>

      <Box p="md">
        <VStack space="lg">
          {/* Card Detail Container */}
          <Card>
            <VStack space="md">
              <Typography variant="h3" style={{ fontWeight: '800' }}>
                {t('protected.details.subtitle', { id })}
              </Typography>

              {/* Metadata */}
              <VStack
                space="xs"
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border.default,
                  paddingBottom: theme.spacing.md,
                }}
              >
                <HStack space="sm" align="center">
                  <Calendar size={16} color={theme.colors.text.subtle} />
                  <Typography variant="caption" color={theme.colors.text.subtle}>
                    {t('protected.details.published', { date: formatDate(mockDate) })}
                  </Typography>
                </HStack>
                <HStack space="sm" align="center" style={{ marginTop: 4 }}>
                  <User size={16} color={theme.colors.text.subtle} />
                  <Typography variant="caption" color={theme.colors.text.subtle}>
                    {t('protected.details.author', { author: mockAuthor })}
                  </Typography>
                </HStack>
              </VStack>

              {/* Body Text */}
              <Typography variant="body" style={{ lineHeight: 24 }}>
                {t('protected.details.sampleParagraph')}
              </Typography>
            </VStack>
          </Card>

          {/* Back button */}
          <Button
            label={t('protected.details.back')}
            onPress={() => router.back()}
            variant="outline"
          />
        </VStack>
      </Box>
    </Screen>
  );
}
