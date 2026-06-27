import React from 'react';
import { Pressable, PressableProps, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';
import { Box } from './Box';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
  textColor?: string;
}

export function Button({
  variant = 'solid',
  size = 'md',
  label,
  isLoading,
  leftIcon,
  rightIcon,
  isFullWidth,
  textColor,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  // Size configurations
  const sizes = {
    sm: { height: 32, px: theme.spacing.sm, fontSize: theme.typography.sizes.sm },
    md: { height: 44, px: theme.spacing.lg, fontSize: theme.typography.sizes.md },
    lg: { height: 52, px: theme.spacing.xl, fontSize: theme.typography.sizes.lg },
  };

  const currentSize = sizes[size];

  const isIconOnly = !label;

  // Variant configurations
  const getVariantStyle = (pressed: boolean): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: isIconOnly ? theme.radius.full : theme.radius.md,
      paddingHorizontal: isIconOnly ? 0 : currentSize.px,
      height: currentSize.height,
      width: isIconOnly ? currentSize.height : isFullWidth ? '100%' : undefined,
      opacity: pressed || disabled || isLoading ? 0.7 : 1,
    };

    switch (variant) {
      case 'solid':
        return {
          ...base,
          backgroundColor: theme.colors.primary,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: pressed ? theme.colors.background.subtle : 'transparent',
        };
    }
  };

  const getTextColor = () => {
    if (textColor) return textColor;
    if (variant === 'solid') return theme.colors.text.inverse;
    return theme.colors.primary;
  };

  return (
    <Pressable
      style={({ pressed }) => [getVariantStyle(pressed), style as ViewStyle]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {isIconOnly ? (
            leftIcon || rightIcon
          ) : (
            <>
              {leftIcon && <Box style={{ marginRight: theme.spacing.xs }}>{leftIcon}</Box>}
              <Typography
                style={{
                  color: getTextColor(),
                  fontSize: currentSize.fontSize,
                  fontWeight: theme.typography.weights.semibold as any,
                }}
              >
                {label}
              </Typography>
              {rightIcon && <Box style={{ marginLeft: theme.spacing.xs }}>{rightIcon}</Box>}
            </>
          )}
        </>
      )}
    </Pressable>
  );
}
