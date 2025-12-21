import React from 'react';
import { useTheme } from '@/theme/ThemeContext';
import { EmptyState } from './EmptyState';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react-native';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error loading this content.',
  onRetry,
  retryLabel = 'Try Again',
}: ErrorStateProps) => {
  const { theme } = useTheme();

  return (
    <EmptyState
      title={title}
      description={description}
      icon={<AlertCircle size={64} color={theme.colors.error.main} />}
      action={
        onRetry ? <Button label={retryLabel} onPress={onRetry} variant="outline" /> : undefined
      }
    />
  );
};
