import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, DimensionValue } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  variant?: 'rect' | 'circle';
  style?: ViewStyle;
}

export const Skeleton = ({
  width = '100%',
  height = 20,
  variant = 'rect',
  style,
}: SkeletonProps) => {
  const { theme, isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  const baseColor = isDark ? theme.colors.neutral[700] : theme.colors.neutral[200];
  const borderRadius = variant === 'circle' ? 9999 : theme.radius.md;

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: baseColor,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};
