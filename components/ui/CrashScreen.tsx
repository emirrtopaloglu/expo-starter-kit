import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Box } from '@/components/ui/Box';
import { AlertOctagon } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import * as Updates from 'expo-updates';

interface CrashScreenProps {
  error: Error | null;
  resetError: () => void;
}

export const CrashScreen = ({ error, resetError }: CrashScreenProps) => {
  const { theme } = useTheme();

  const handleRestart = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      // Fallback if Updates not available (e.g. dev client sometimes)
      resetError();
    }
  };

  return (
    <Screen
      safeAreaEdges={['top', 'bottom']}
      preset="fixed"
      contentContainerStyle={styles.container}
    >
      <Box style={[styles.iconContainer, { backgroundColor: theme.colors.background.subtle }]}>
        <AlertOctagon size={64} color={theme.colors.error.main} />
      </Box>

      <Typography variant="h2" style={{ textAlign: 'center', marginBottom: 12 }}>
        Oops! Something went wrong.
      </Typography>

      <Typography
        variant="body"
        style={{ textAlign: 'center', color: theme.colors.text.subtle, marginBottom: 32 }}
      >
        {error?.message || 'An unexpected error occurred. We have captured this report.'}
      </Typography>

      <View style={{ width: '100%', gap: 16 }}>
        <Button label="Try Again" onPress={resetError} variant="solid" />
        <Button label="Restart App" onPress={handleRestart} variant="outline" />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
});
