import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { colors } from '@/theme/tokens/colors';

// Define the two types of palettes we have
type SemanticPalette = typeof colors.success;

interface BadgeProps {
  label: string;
  variant?: 'solid' | 'outline' | 'subtle';
  colorScheme?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge = ({
  label,
  variant = 'subtle',
  colorScheme = 'primary',
  size = 'md',
}: BadgeProps) => {
  const { theme, isDark } = useTheme();

  const getColors = () => {
    // 1. Resolve the palette based on colorScheme
    const paletteMap = {
      primary: colors.primary, // Use full token scale for shade lookup
      success: theme.colors.success,
      error: theme.colors.error,
      warning: theme.colors.warning,
      info: theme.colors.info,
      neutral: theme.colors.neutral,
    };

    // Safety fallback
    const palette = paletteMap[colorScheme] || theme.colors.primary;

    // 2. Normalize values (Main, Light, Dark)
    let mainColor: string;
    let lightBg: string;
    let darkBg: string;
    let lightText: string;
    let darkText: string;

    if (colorScheme === 'primary' || colorScheme === 'neutral') {
      // It's a ScalePalette (50-900)
      // We cast to any because accessing by index is safe here based on known structure
      const p = palette as any;
      mainColor = p[500] || '#000';
      lightBg = p[100] || '#f0f0f0';
      darkBg = p[900] || '#111';
      lightText = p[700] || '#333';
      darkText = p[200] || '#ccc';
    } else {
      // It's a SemanticPalette (main, light, dark)
      const p = palette as SemanticPalette;
      mainColor = p.main;
      lightBg = p.light;
      darkBg = p.dark;
      // For semantic palettes, we use the dark variant for text on light bg, and light variant for text on dark bg
      lightText = p.dark;
      darkText = p.light;
    }

    // 3. Assign based on variant
    let bg, text, border;

    switch (variant) {
      case 'solid':
        bg = mainColor;
        text = '#FFFFFF';
        border = mainColor;
        break;
      case 'outline':
        bg = 'transparent';
        text = mainColor;
        border = mainColor;
        break;
      case 'subtle':
      default:
        bg = isDark ? darkBg : lightBg;
        text = isDark ? darkText : lightText;
        border = 'transparent';
        break;
    }

    return { bg, text, border };
  };

  const { bg, text, border } = getColors();

  return (
    <View
      style={{
        backgroundColor: bg,
        borderColor: border,
        borderWidth: variant === 'outline' ? 1 : 0, // Hairline border width for cleaner look
        borderRadius: 100, // Explicit large number for pill shape
        paddingHorizontal: size === 'sm' ? 8 : 12, // Increased padding
        paddingVertical: size === 'sm' ? 2 : 4,
        alignSelf: 'flex-start',
        minWidth: size === 'sm' ? 24 : 32, // Minimum width
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: text,
          fontSize: size === 'sm' ? 11 : 13, // Slightly larger font
          fontWeight: '700', // Bolder text
          fontFamily: theme.typography.families.bold,
          includeFontPadding: false, // Android fix for vertical alignment
          textAlign: 'center',
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};
