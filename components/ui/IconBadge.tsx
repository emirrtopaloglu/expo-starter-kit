import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Box } from './Box';

interface IconBadgeProps {
  children: React.ReactNode; // The base icon to wrap (e.g. <Bell />)
  count?: number; // The notification/badge count
  maxCount?: number; // e.g. 99, will display as '99+' if count exceeds this
  showDot?: boolean; // If true, renders a small dot indicator instead of a number
  badgeColor?: string; // Custom badge background color (defaults to theme.colors.error.main)
  textColor?: string; // Custom badge text color (defaults to white)
  size?: 'sm' | 'md'; // Size of the badge/dot
}

/**
 * IconBadge: A wrapper that renders a notification badge or status dot over any child (typically an icon).
 */
export const IconBadge = ({
  children,
  count = 0,
  maxCount = 99,
  showDot = false,
  badgeColor,
  textColor = '#FFFFFF',
  size = 'md',
}: IconBadgeProps) => {
  const { theme } = useTheme();

  const hasCount = count > 0;
  const shouldRenderBadge = showDot || hasCount;

  if (!shouldRenderBadge) {
    return <Box style={{ position: 'relative' }}>{children}</Box>;
  }

  // Determine badge text
  const badgeText =
    hasCount && !showDot ? (count > maxCount ? `${maxCount}+` : count.toString()) : '';

  const backgroundColor = badgeColor || theme.colors.error.main;

  // Layout sizing based on variant (dot vs count, and size prop)
  const isDotOnly = showDot || !hasCount;
  const badgeSize = isDotOnly ? (size === 'sm' ? 8 : 10) : size === 'sm' ? 15 : 18; // Reduced height slightly to avoid huge badges

  // Custom positioning offsets depending on whether it's a dot or a large text badge
  const offset = isDotOnly ? (size === 'sm' ? -2 : -3) : size === 'sm' ? -4 : -5;

  return (
    <Box style={{ position: 'relative', alignSelf: 'flex-start' }}>
      {children}
      <View
        style={[
          styles.badge,
          {
            backgroundColor,
            minWidth: badgeSize,
            height: badgeSize,
            borderRadius: 999, // Always renders a perfect circle or capsule pill
            top: offset,
            right: offset,
            paddingHorizontal: isDotOnly ? 0 : size === 'sm' ? 3 : 5,
          },
        ]}
      >
        {!isDotOnly && (
          <Text
            style={{
              color: textColor,
              fontSize: size === 'sm' ? 8.5 : 10, // Slightly smaller font size to fit double digits beautifully
              fontWeight: '700',
              fontFamily: theme.typography.families.bold, // Use strict bold font family
              textAlign: 'center',
              includeFontPadding: false, // Android alignment fix
              textAlignVertical: 'center', // Android alignment fix
              // iOS vertical alignment adjustment for Plus Jakarta Sans font
              marginTop: Platform.OS === 'ios' ? -0.5 : 0,
            }}
          >
            {badgeText}
          </Text>
        )}
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Thin border for a premium look
    borderColor: '#FFFFFF', // White ring for separation
    zIndex: 10,
  },
});
