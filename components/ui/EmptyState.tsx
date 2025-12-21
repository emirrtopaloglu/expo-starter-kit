import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';
import { Box } from './Box';
import { Box as BoxIcon } from 'lucide-react-native'; // Default icon

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({
  title = 'No Data',
  description = 'There is nothing here yet.',
  icon,
  action,
}: EmptyStateProps) => {
  const { theme } = useTheme();

  return (
    <Box
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
        opacity: 0.8,
      }}
    >
      <Box mb="md">{icon || <BoxIcon size={64} color={theme.colors.neutral[300]} />}</Box>
      <Typography variant="h3" style={{ textAlign: 'center', marginBottom: 8 }}>
        {title}
      </Typography>
      <Typography
        variant="body"
        color={theme.colors.text.subtle}
        style={{ textAlign: 'center', maxWidth: 300, marginBottom: action ? 24 : 0 }}
      >
        {description}
      </Typography>
      {action}
    </Box>
  );
};
