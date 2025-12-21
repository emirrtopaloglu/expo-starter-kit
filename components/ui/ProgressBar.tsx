import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, DimensionValue } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
  width?: DimensionValue;
}

export const ProgressBar = ({ progress, color, height = 8, width = '100%' }: ProgressBarProps) => {
  const { theme } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 300,
      useNativeDriver: false, // Width cannot utilize native driver
    }).start();
  }, [clampedProgress]);

  const trackColor = theme.colors.neutral[200];
  const progressColor = color || theme.colors.primary[500];

  return (
    <View
      style={{
        height,
        width,
        backgroundColor: trackColor,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          height: '100%',
          backgroundColor: progressColor,
          width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
          borderRadius: height / 2,
        }}
      />
    </View>
  );
};
