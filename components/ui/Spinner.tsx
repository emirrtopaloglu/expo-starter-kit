import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

interface SpinnerProps extends ActivityIndicatorProps {
  color?: string;
}

export const Spinner = ({ size = 'small', color, ...props }: SpinnerProps) => {
  const { theme } = useTheme();

  // Default to primary color if not specified
  const spinnerColor = color || theme.colors.primary;

  return <ActivityIndicator size={size} color={spinnerColor} {...props} />;
};
