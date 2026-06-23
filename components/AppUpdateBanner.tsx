import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAppUpdate } from '@/hooks/useAppUpdate';
import { useTheme } from '@/theme/ThemeContext';
import { Box } from '@/components/ui/Box';
import { HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Spinner } from '@/components/ui/Spinner';
import { Download } from 'lucide-react-native';

/**
 * AppUpdateBanner: A floating notification banner that appears at the top of the app
 * when a new JS bundle update is fetched and ready to install.
 */
export function AppUpdateBanner() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { isUpdateAvailable, isUpdateDownloading, runUpdate } = useAppUpdate();

  if (!isUpdateAvailable && !isUpdateDownloading) {
    return null;
  }

  const handlePress = () => {
    if (isUpdateAvailable) {
      runUpdate();
    }
  };

  // Safe area top offset + small padding
  const topOffset = Math.max(insets.top, 10);

  return (
    <Box
      shadow="md"
      rounded="md"
      style={[
        styles.bannerContainer,
        {
          top: topOffset,
          backgroundColor: theme.colors.primary,
          marginHorizontal: theme.spacing.md,
        },
      ]}
    >
      <Pressable onPress={handlePress} disabled={isUpdateDownloading} style={styles.pressable}>
        <HStack space="sm" align="center" justify="space-between">
          <HStack space="sm" align="center" style={{ flex: 1 }}>
            {isUpdateDownloading ? (
              <Spinner size="small" color="white" />
            ) : (
              <Download size={20} color="white" />
            )}
            <Typography
              variant="bodySmall"
              color="white"
              weight="semibold"
              style={{ flex: 1 }}
            >
              {isUpdateDownloading
                ? t('update.downloading', 'Downloading update...')
                : t('update.available', 'A new update is available. Click to relaunch.')}
            </Typography>
          </HStack>
        </HStack>
      </Pressable>
    </Box>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  pressable: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
});
