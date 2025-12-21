import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Box } from './Box';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  style,
  ...props
}: InputProps) {
  const { theme } = useTheme();

  return (
    <Box mb={theme.spacing.md}>
      {label && (
        <Typography
          variant="bodySmall"
          style={{ marginBottom: theme.spacing.xs, fontWeight: '500' }}
        >
          {label}
        </Typography>
      )}
      <Box
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? theme.colors.error.main : theme.colors.border.default,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.background.paper,
          paddingHorizontal: theme.spacing.md,
          height: 48,
        }}
      >
        {leftIcon && <Box mr={theme.spacing.sm}>{leftIcon}</Box>}
        <TextInput
          style={[
            {
              flex: 1,
              color: theme.colors.text.default,
              fontSize: theme.typography.sizes.md,
              height: '100%',
            },
            style,
          ]}
          placeholderTextColor={theme.colors.text.subtle}
          {...props}
        />
        {rightIcon && <Box ml={theme.spacing.sm}>{rightIcon}</Box>}
      </Box>
      {error && (
        <Typography
          variant="caption"
          color={theme.colors.error.main}
          style={{ marginTop: theme.spacing.xs }}
        >
          {error}
        </Typography>
      )}
      {helperText && !error && (
        <Typography
          variant="caption"
          color={theme.colors.text.subtle}
          style={{ marginTop: theme.spacing.xs }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
