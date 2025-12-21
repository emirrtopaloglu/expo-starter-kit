import React, { useState } from 'react';
import { Image, View, StyleSheet, ImageSourcePropType } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';

interface AvatarProps {
  src?: string | ImageSourcePropType;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  alt?: string;
}

export const Avatar = ({ src, fallback = '?', size = 'md', alt }: AvatarProps) => {
  const { theme, isDark } = useTheme();
  const [hasError, setHasError] = useState(false);

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return 32;
      case 'md':
        return 48;
      case 'lg':
        return 64;
      case 'xl':
        return 96;
      default:
        return 48;
    }
  };

  const dimension = getDimensions();
  const fontSize = dimension * 0.4;

  const renderContent = () => {
    if (src && !hasError) {
      return (
        <Image
          source={typeof src === 'string' ? { uri: src } : src}
          style={{ width: dimension, height: dimension, borderRadius: 999 }}
          onError={() => setHasError(true)}
          accessibilityLabel={alt}
        />
      );
    }

    return (
      <View
        style={{
          width: dimension,
          height: dimension,
          borderRadius: 999,
          backgroundColor: isDark ? theme.colors.neutral[800] : theme.colors.neutral[200],
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        }}
      >
        <Typography
          style={{
            fontSize,
            fontWeight: '600',
            color: theme.colors.text.subtle,
          }}
        >
          {fallback.substring(0, 2).toUpperCase()}
        </Typography>
      </View>
    );
  };

  return renderContent();
};
