import React from 'react';
import { ViewStyle } from 'react-native';
import { Box, BoxProps } from './Box';
import { useTheme } from '@/theme/ThemeContext';
import { Theme } from '@/theme';

interface StackProps extends BoxProps {
  space?: keyof Theme['spacing'] | number; // Gap
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: ViewStyle['flexWrap'];
}

export function HStack({ space, align, justify, wrap, style, ...props }: StackProps) {
  const { theme } = useTheme();
  const gap = typeof space === 'number' ? space : space ? theme.spacing[space] : 0;

  return (
    <Box
      style={[
        {
          flexDirection: 'row',
          gap,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function VStack({ space, align, justify, style, ...props }: StackProps) {
  const { theme } = useTheme();
  const gap = typeof space === 'number' ? space : space ? theme.spacing[space] : 0;

  return (
    <Box
      style={[
        {
          flexDirection: 'column',
          gap,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
      {...props}
    />
  );
}
