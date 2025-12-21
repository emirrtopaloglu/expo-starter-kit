import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Theme } from '@/theme';

export type TypographyVariant = keyof Theme['typography']['variants'];

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

export function Typography({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}: TypographyProps) {
  const { theme } = useTheme();

  const textStyle = {
    ...theme.typography.variants[variant],
    color: color || theme.colors.text.default,
    textAlign: align,
  };

  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
}
