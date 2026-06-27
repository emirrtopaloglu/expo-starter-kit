import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';
import { Box } from './Box';
import { ChevronRight } from 'lucide-react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  showChevron?: boolean;
}

export const ListItem = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  style,
  showChevron,
}: ListItemProps) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
          backgroundColor: pressed
            ? theme.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)'
            : 'transparent',
          opacity: pressed ? 0.95 : 1,
        },
        style,
      ]}
      disabled={!onPress}
    >
      {leftIcon && <Box mr={theme.spacing.md}>{leftIcon}</Box>}

      <Box style={{ flex: 1 }}>
        <Typography variant="body" style={{ fontWeight: '500' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color={theme.colors.text.subtle} style={{ marginTop: 2 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Right side logic: custom icon OR chevron, not both usually, but flexible */}
      {rightIcon && <Box ml={theme.spacing.sm}>{rightIcon}</Box>}

      {showChevron && !rightIcon && (
        <Box ml={theme.spacing.sm}>
          <ChevronRight size={20} color={theme.colors.text.subtle} />
        </Box>
      )}
    </Pressable>
  );
};
