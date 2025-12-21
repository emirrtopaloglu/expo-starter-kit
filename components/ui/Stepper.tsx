import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';
import { Minus, Plus } from 'lucide-react-native';

interface StepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Stepper = ({ value, onChange, min = 0, max = 100, step = 1 }: StepperProps) => {
  const { theme, isDark } = useTheme();

  const handleDecrease = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  const handleIncrease = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  const canDecrease = value - step >= min;
  const canIncrease = value + step <= max;

  const Button = ({
    onPress,
    icon,
    disabled,
  }: {
    onPress: () => void;
    icon: React.ReactNode;
    disabled: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: 36,
        height: 36,
        borderRadius: theme.radius.md,
        backgroundColor: disabled
          ? isDark
            ? theme.colors.neutral[800]
            : theme.colors.neutral[100]
          : isDark
            ? theme.colors.neutral[700]
            : theme.colors.neutral[200],
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
    </TouchableOpacity>
  );

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Button
        onPress={handleDecrease}
        disabled={!canDecrease}
        icon={<Minus size={18} color={theme.colors.text.default} />}
      />

      <View style={{ marginHorizontal: theme.spacing.md, minWidth: 40, alignItems: 'center' }}>
        <Typography variant="h4">{value}</Typography>
      </View>

      <Button
        onPress={handleIncrease}
        disabled={!canIncrease}
        icon={<Plus size={18} color={theme.colors.text.default} />}
      />
    </View>
  );
};
