import React from 'react';
import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export interface ImageProps extends ExpoImageProps {
  /**
   * Helper to set aspect ratio
   */
  aspectRatio?: number;
  /**
   * Border radius preset
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

/**
 * A highly performant image component with built-in caching, lazy loading, and blurhash support.
 * Wraps `expo-image` to provide consistent styling and defaults.
 *
 * @example
 * <Image
 *   source="https://example.com/image.jpg"
 *   style={{ width: 100, height: 100 }}
 *   rounded="md"
 *   transition={200}
 * />
 */
export const Image = ({
  style,
  aspectRatio,
  rounded = 'none',
  contentFit = 'cover',
  transition = 300,
  ...props
}: ImageProps) => {
  const { theme } = useTheme();

  const getBorderRadius = () => {
    switch (rounded) {
      case 'sm':
        return theme.radius.sm;
      case 'md':
        return theme.radius.md;
      case 'lg':
        return theme.radius.lg;
      case 'full':
        return theme.radius.full;
      default:
        return 0;
    }
  };

  const flattenStyle = StyleSheet.flatten([
    style,
    aspectRatio && { aspectRatio },
    { borderRadius: getBorderRadius() },
  ]) as any; // Cast to any to avoid ViewStyle/ImageStyle mismatch since ExpoImage accepts both

  return (
    <ExpoImage style={flattenStyle} contentFit={contentFit} transition={transition} {...props} />
  );
};
