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

    switch (weight) {
      case 'regular':
        return { fontFamily: theme.typography.families.regular };
      case 'medium':
        return { fontFamily: theme.typography.families.medium };
      case 'semibold':
        return { fontFamily: theme.typography.families.semibold };
      case 'bold':
        return { fontFamily: theme.typography.families.bold };
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
