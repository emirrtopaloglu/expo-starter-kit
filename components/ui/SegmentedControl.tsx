import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, LayoutChangeEvent } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const SegmentedControl = ({ options, selectedIndex, onChange }: SegmentedControlProps) => {
  const { theme, isDark } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const containerWidth = useRef(0);

  useEffect(() => {
    if (containerWidth.current > 0) {
      const segmentWidth = containerWidth.current / options.length;
      Animated.spring(translateX, {
        toValue: selectedIndex * segmentWidth,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }
  }, [selectedIndex, options.length]);

  return (
    <View
      style={{
        backgroundColor: isDark ? theme.colors.neutral[900] : theme.colors.neutral[200],
        borderRadius: theme.radius.md,
        padding: 4,
        flexDirection: 'row',
        height: 40,
      }}
      onLayout={(e) => {
        containerWidth.current = e.nativeEvent.layout.width - 8; // Adjust for padding
      }}
    >
      {/* Animated Indicator */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 4,
          width: `${100 / options.length}%`,
          backgroundColor: theme.colors.background.paper,
          borderRadius: theme.radius.sm,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
          transform: [{ translateX }],
        }}
      />

      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChange(index)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="bodySmall"
              style={{
                fontWeight: '600',
                color: isSelected ? theme.colors.text.default : theme.colors.text.subtle,
              }}
            >
              {option}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
