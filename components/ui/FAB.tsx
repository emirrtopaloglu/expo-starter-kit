import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Plus } from 'lucide-react-native';
import { Typography } from './Typography';

interface FABProps {
  onPress: () => void;
  icon?: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-center' | 'none';
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export const FAB = ({
  onPress,
  icon,
  label,
  position = 'bottom-right',
  style,
  color,
}: FABProps) => {
  const { theme } = useTheme();

  const backgroundColor = color || theme.colors.primary;

  const positioningStyle: ViewStyle =
    position !== 'none'
      ? {
          position: 'absolute',
          bottom: theme.spacing.lg,
          right: position === 'bottom-right' ? theme.spacing.lg : undefined,
          alignSelf: position === 'bottom-center' ? 'center' : undefined,
          zIndex: 50,
        }
      : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        {
          backgroundColor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: label ? 12 : 16,
          paddingHorizontal: label ? 20 : 16,
          borderRadius: 999,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
          minWidth: label ? 100 : 56,
          height: 56,
        },
        positioningStyle,
        style,
      ]}
    >
      {icon || <Plus size={24} color="white" />}
      {label && (
        <Typography
          variant="body"
          style={{
            color: 'white',
            marginLeft: 8,
            fontWeight: '600',
          }}
        >
          {label}
        </Typography>
      )}
    </TouchableOpacity>
  );
};
