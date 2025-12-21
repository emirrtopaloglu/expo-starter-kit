import React, { useEffect } from 'react';
import { Pressable, View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Check } from 'lucide-react-native';
import { Typography } from './Typography';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Checkbox = ({ checked, onCheckedChange, label, disabled }: CheckboxProps) => {
  const { theme } = useTheme();
  // Animation value: 0 -> unchecked, 1 -> checked
  const scale = React.useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: checked ? 1 : 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  }, [checked]);

  const toggle = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  const checkboxSize = 24;
  const iconSize = 16;
  const activeColor = disabled ? theme.colors.neutral[400] : theme.colors.primary;
  const inactiveBorder = theme.colors.neutral[300];

  return (
    <Pressable
      onPress={toggle}
      style={{ flexDirection: 'row', alignItems: 'center', opacity: disabled ? 0.6 : 1 }}
    >
      <View
        style={{
          width: checkboxSize,
          height: checkboxSize,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: checked ? activeColor : inactiveBorder,
          backgroundColor: checked ? activeColor : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: label ? 8 : 0,
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Check size={iconSize} color="#FFF" strokeWidth={3} />
        </Animated.View>
      </View>
      {label && <Typography variant="body">{label}</Typography>}
    </Pressable>
  );
};
