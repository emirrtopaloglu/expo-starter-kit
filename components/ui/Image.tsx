import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image';
import { useTheme } from '@/theme/ThemeContext';
import { ImageOff } from 'lucide-react-native';
import { Box } from './Box';
import { Skeleton } from './Skeleton';

export interface ImageProps extends ExpoImageProps {
  /**
   * Helper to set aspect ratio
   */
  aspectRatio?: number;
  /**
   * Border radius preset
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /**
   * Whether to show a loading skeleton overlay while the image loads
   */
  showLoader?: boolean;
  /**
   * Whether to render an error fallback placeholder when the load fails
   */
  showErrorFallback?: boolean;
  /**
   * Custom Blurhash code to display while loading.
   * If provided, passes it directly to expo-image placeholder.
   */
  blurhash?: string;
}

// A standard, premium blurhash placeholder
const DEFAULT_BLURHASH = 'L6PZ|Ye.dGg2_Cx^VsWp.oR+J6V@';

/**
 * A highly performant image component with built-in disk caching, transition effects, and blurhash.
 * Wraps `expo-image` to provide consistent styling, cache configuration, and loading/error placeholders.
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
  cachePolicy = 'disk', // Defaults strictly to disk caching
  showLoader = true,
  showErrorFallback = true,
  blurhash,
  placeholder,
  onLoadStart,
  onLoad,
  onError,
  ...props
}: ImageProps) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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

  const borderRadius = getBorderRadius();

  const containerStyle = StyleSheet.flatten([
    style,
    aspectRatio && { aspectRatio },
    { borderRadius, overflow: 'hidden', position: 'relative' },
  ]) as any;

  const imageStyle = {
    width: '100%',
    height: '100%',
  } as any;

  // Determine placeholder (either explicit, custom blurhash, or default blurhash)
  const resolvedPlaceholder = placeholder || { blurhash: blurhash || DEFAULT_BLURHASH };

  return (
    <Box style={containerStyle}>
      <ExpoImage
        style={imageStyle}
        contentFit={contentFit}
        transition={transition}
        cachePolicy={cachePolicy}
        placeholder={resolvedPlaceholder}
        onLoadStart={() => {
          setIsLoading(true);
          setHasError(false);
          onLoadStart?.();
        }}
        onLoad={(e: any) => {
          setIsLoading(false);
          onLoad?.(e);
        }}
        onError={(e: any) => {
          setIsLoading(false);
          setHasError(true);
          onError?.(e);
        }}
        {...props}
      />

      {/* Loading Overlay */}
      {isLoading && showLoader && (
        <Box style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.colors.background.subtle }]}>
          <Skeleton style={{ width: '100%', height: '100%' }} />
        </Box>
      )}

      {/* Error Overlay */}
      {hasError && showErrorFallback && (
        <Box
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.colors.background.subtle,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: theme.colors.border.subtle,
            },
          ]}
        >
          <ImageOff size={24} color={theme.colors.text.subtle} />
        </Box>
      )}
    </Box>
  );
};
