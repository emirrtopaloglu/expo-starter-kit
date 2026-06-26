import React from 'react';
import { View, Text, Pressable, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Box } from './Box';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

// Sub-components defined as standalone to satisfy linter and hook rules
const CardHeader = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => (
  <Box mb="sm" style={style}>
    {children}
  </Box>
);
CardHeader.displayName = 'Card.Header';

const CardBody = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => <Box style={style}>{children}</Box>;
CardBody.displayName = 'Card.Body';

const CardFooter = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => (
  <Box mt="md" style={style}>
    {children}
  </Box>
);
CardFooter.displayName = 'Card.Footer';

const CardTitle = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        fontSize: theme.typography.sizes.lg,
        fontWeight: 'bold',
        fontFamily: theme.typography.families.bold,
        color: theme.colors.text.default,
      }}
    >
      {children}
    </Text>
  );
};
CardTitle.displayName = 'Card.Title';

export const Card = ({
  children,
  variant = 'elevated',
  padding = 'md',
  onPress,
  style,
}: CardProps) => {
  const { theme, isDark } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return isDark ? theme.colors.neutral[800] : theme.colors.neutral[50];
      case 'outlined':
        return 'transparent';
      case 'filled':
        return isDark ? theme.colors.neutral[900] : theme.colors.neutral[100];
      default:
        return theme.colors.background.card;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outlined') {
      return theme.colors.border.default;
    }
    return 'transparent';
  };

  const getShadow = () => {
    if (variant === 'elevated') {
      return theme.shadows.sm;
    }
    return {};
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };

  const containerStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderRadius: theme.radius.lg,
    padding: getPadding(),
    ...getShadow(),
  };

  const Content = <View style={[containerStyle, style]}>{children}</View>;

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}>
        {Content}
      </Pressable>
    );
  }

  return Content;
};

// Attach sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
