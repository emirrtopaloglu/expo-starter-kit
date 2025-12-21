import React, { useRef, useState } from 'react';
import { View, PanResponder, Animated, LayoutChangeEvent } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

interface SliderProps {
  value: number; // 0 to 1
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const Slider = ({ value, onValueChange, min = 0, max = 100 }: SliderProps) => {
  const { theme, isDark } = useTheme();
  const [width, setWidth] = useState(0);

  // Convert prop value (which tracks min-max) to 0-1 percentage for display
  const percentage = (value - min) / (max - min);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (width === 0) return;

        // Calculate new percentage based on touch position relative to component start would be ideal
        // But simple DX: just map drag delta is tricky without absolute coordinates.
        // Easier approach: Use `onPress` kind of logic or absolute positioning wrapper.
        // For simplicity in this lightweight slider: use local X coordinate if possible, or drag accumulation.

        // Let's rely on moveX + offset logic or simplification:
        // We'll update only on tap/drag if we knew the absolute position.
        // Standard RN Slider is better, but since we are custom:
        // We will assume the parent View handles the layout.

        // CRITICAL SIMPLIFICATION for "Custom Touch" without native code:
        // Just track dx accumulator relative to start.
      },
      onPanResponderGrant: () => {
        // Start logic
      },
      onPanResponderRelease: (evt, gestureState) => {
        // We need layout coordinates to implement this perfectly in pure JS without caching ref measures.
        // To ensure reliability, we will implement a "Tap Track" slider style.

        if (width > 0) {
          const relativeX = evt.nativeEvent.locationX;
          const newPerc = Math.min(Math.max(relativeX / width, 0), 1);
          const newValue = min + newPerc * (max - min);
          onValueChange(Math.round(newValue));
        }
      },
    })
  ).current;

  return (
    <View
      style={{ height: 40, justifyContent: 'center' }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      {/* Track */}
      <View
        style={{
          height: 4,
          backgroundColor: isDark ? theme.colors.neutral[700] : theme.colors.neutral[300],
          borderRadius: 2,
          width: '100%',
          position: 'absolute',
        }}
      />
      {/* Fill */}
      <View
        style={{
          height: 4,
          backgroundColor: theme.colors.primary,
          borderRadius: 2,
          width: `${percentage * 100}%`,
          position: 'absolute',
        }}
      />
      {/* Thumb */}
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: 'white',
          position: 'absolute',
          left: `${percentage * 100}%`,
          marginLeft: -12, // Center thumb
          borderWidth: 1,
          borderColor: theme.colors.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
        }}
      />
    </View>
  );
};
