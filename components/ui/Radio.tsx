import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';

interface RadioContextType {
  value: string;
  onChange: (value: string) => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

// Radio Group
interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

const RadioGroup = ({ value, onChange, children }: RadioGroupProps) => {
  return (
    <RadioContext.Provider value={{ value, onChange }}>
      <View role="radiogroup">{children}</View>
    </RadioContext.Provider>
  );
};

// Radio Item
interface RadioProps {
  value: string;
  label?: string;
  disabled?: boolean;
}

const Radio = ({ value: itemValue, label, disabled }: RadioProps) => {
  const context = useContext(RadioContext);
  const { theme } = useTheme();

  if (!context) {
    throw new Error('Radio must be used within a Radio.Group');
  }

  const { value, onChange } = context;
  const isSelected = value === itemValue;

  const handlePress = () => {
    if (!disabled) {
      onChange(itemValue);
    }
  };

  const radioSize = 24;
  const dotSize = 12;
  const activeColor = disabled ? theme.colors.neutral[400] : theme.colors.primary;
  const inactiveBorder = theme.colors.neutral[300];

  return (
    <Pressable
      onPress={handlePress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <View
        style={{
          width: radioSize,
          height: radioSize,
          borderRadius: radioSize / 2,
          borderWidth: 2,
          borderColor: isSelected ? activeColor : inactiveBorder,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: label ? 8 : 0,
        }}
      >
        {isSelected && (
          <View
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: activeColor,
            }}
          />
        )}
      </View>
      {label && <Typography variant="body">{label}</Typography>}
    </Pressable>
  );
};

// Export as compound component
Radio.Group = RadioGroup;

export { Radio };
