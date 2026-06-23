import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Theme } from '@/theme';

export type TypographyVariant = keyof Theme['typography']['variants'];

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
}

export function Typography({
  variant = 'body',
  color,
  align,
  weight,
  style,
  children,
  ...props
}: TypographyProps) {
  const { theme } = useTheme();

  const getFontFamilyOverride = () => {
    if (!weight) return {};

    // Use dynamic theme fonts mapping if available, falling back to defaults
    const themeFonts = (theme.typography as any).fonts || {};

    switch (weight) {
      case 'regular':
        return { fontFamily: themeFonts.regular || 'PlusJakartaSans_400Regular' };
      case 'medium':
        return { fontFamily: themeFonts.medium || 'PlusJakartaSans_500Medium' };
      case 'semibold':
        return { fontFamily: themeFonts.semibold || 'PlusJakartaSans_600SemiBold' };
      case 'bold':
        return { fontFamily: themeFonts.bold || 'PlusJakartaSans_700Bold' };
      default:
        return {};
    }
  };

  const textStyle = {
    ...theme.typography.variants[variant],
    ...getFontFamilyOverride(),
    color: color || theme.colors.text.default,
    textAlign: align,
  };

  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
}
