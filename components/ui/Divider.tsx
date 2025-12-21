import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  width?: number; // thickness
  color?: string;
  label?: string;
  style?: ViewStyle;
}

export const Divider = ({
  orientation = 'horizontal',
  width = 1,
  color,
  label,
  style,
}: DividerProps) => {
  const { theme } = useTheme();
  const dividerColor = color || theme.colors.border.default;

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          {
            width,
            height: '100%',
            backgroundColor: dividerColor,
          },
          style,
        ]}
      />
    );
  }

  // Horizontal
  if (label) {
    return (
      <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
        <View style={{ flex: 1, height: width, backgroundColor: dividerColor }} />
        <View style={{ paddingHorizontal: theme.spacing.sm }}>
          <Typography variant="caption" color={theme.colors.text.subtle}>
            {label}
          </Typography>
        </View>
        <View style={{ flex: 1, height: width, backgroundColor: dividerColor }} />
      </View>
    );
  }

  return (
    <View
      style={[
        {
          width: '100%',
          height: width,
          backgroundColor: dividerColor,
        },
        style,
      ]}
    />
  );
};
