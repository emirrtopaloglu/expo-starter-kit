import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';

export default function ThemeToggle() {
  const { themePreference, setThemePreference, theme } = useTheme();

  return (
    <View style={styles.container}>
      <Typography
        variant="bodySmall"
        style={{
          color: theme.colors.text.default,
          marginBottom: theme.spacing.xs,
          fontWeight: '600',
        }}
      >
        Theme ({themePreference})
      </Typography>
      <View style={styles.buttonGroup}>
        <Pressable
          style={[styles.button, themePreference === 'light' && styles.activeButton]}
          onPress={() => setThemePreference('light')}
        >
          <Sun size={20} color={themePreference === 'light' ? '#fff' : '#666'} />
        </Pressable>
        <Pressable
          style={[styles.button, themePreference === 'system' && styles.activeButton]}
          onPress={() => setThemePreference('system')}
        >
          <Monitor size={20} color={themePreference === 'system' ? '#fff' : '#666'} />
        </Pressable>
        <Pressable
          style={[styles.button, themePreference === 'dark' && styles.activeButton]}
          onPress={() => setThemePreference('dark')}
        >
          <Moon size={20} color={themePreference === 'dark' ? '#fff' : '#666'} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 2,
  },
  button: {
    padding: 8,
    borderRadius: 6,
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
});
