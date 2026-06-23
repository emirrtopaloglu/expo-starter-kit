import React from 'react';
import { StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from './Typography';
import { HStack } from './Stack';

export interface HeaderRightAction {
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

export interface HeaderProps {
  /**
   * Title text
   */
  title?: string;
  /**
   * Subtitle text
   */
  subtitle?: string;
  /**
   * Alignment of title ('center' or 'left')
   */
  titleAlign?: 'center' | 'left';
  /**
   * Override left icon. If showBackButton is true and leftIcon is provided, renders leftIcon.
   */
  leftIcon?: React.ReactNode;
  /**
   * Callback for left icon press. Defaults to router.back().
   */
  onLeftPress?: () => void;
  /**
   * Force show/hide back button. If undefined, defaults to navigation.canGoBack().
   */
  showBackButton?: boolean;
  /**
   * List of actions displayed on the right side of the header.
   */
  rightActions?: HeaderRightAction[];
  /**
   * Optional custom background color. Defaults to theme.colors.background.paper.
   */
  backgroundColor?: string;
  /**
   * Whether to show a border at the bottom of the header. Defaults to true.
   */
  showBorder?: boolean;
  /**
   * Whether to include top safe area inset. Defaults to true.
   */
  safeArea?: boolean;
  /**
   * Style override
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * A highly customizable navigation header component.
 * Integrates with Expo Router's navigation stack, handles safe area offsets,
 * and matches the active design system theme.
 */
export const Header = ({
  title,
  subtitle,
  titleAlign = 'center',
  leftIcon,
  onLeftPress,
  showBackButton,
  rightActions,
  backgroundColor,
  showBorder = true,
  safeArea = true,
  style,
}: HeaderProps) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();

  // Determine back button visibility based on navigation history
  const canGoBack = navigation.canGoBack();
  const shouldShowBack = showBackButton !== undefined ? showBackButton : canGoBack;

  const handleLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else if (canGoBack) {
      router.back();
    }
  };

  const bg = backgroundColor || theme.colors.background.paper;

  const headerStyle = StyleSheet.flatten([
    {
      backgroundColor: bg,
      paddingTop: safeArea ? insets.top : 0,
      borderBottomWidth: showBorder ? 1 : 0,
      borderBottomColor: theme.colors.border.subtle,
      minHeight: 56 + (safeArea ? insets.top : 0),
    },
    style,
  ]) as ViewStyle;

  return (
    <View style={headerStyle}>
      <View style={styles.container}>
        {/* Left Action Button (Back / Custom) */}
        <View style={styles.leftContainer}>
          {shouldShowBack ? (
            <TouchableOpacity
              onPress={handleLeftPress}
              style={styles.actionButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              {leftIcon || <ChevronLeft size={24} color={theme.colors.text.default} />}
            </TouchableOpacity>
          ) : leftIcon ? (
            <TouchableOpacity
              onPress={handleLeftPress}
              style={styles.actionButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
            >
              {leftIcon}
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Middle Header Title & Subtitle */}
        <View
          style={[
            styles.titleContainer,
            titleAlign === 'left' && styles.titleAlignLeft,
            titleAlign === 'center' && styles.titleAlignCenter,
          ]}
        >
          {title ? (
            <Typography
              variant="body"
              style={{
                fontWeight: '700',
                color: theme.colors.text.default,
                fontSize: theme.typography.sizes.md,
              }}
              numberOfLines={1}
            >
              {title}
            </Typography>
          ) : null}
          {subtitle ? (
            <Typography
              variant="caption"
              color={theme.colors.text.subtle}
              numberOfLines={1}
              style={{ marginTop: 2 }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </View>

        {/* Right Action Icons */}
        <HStack space="xs" align="center" style={styles.rightContainer}>
          {rightActions?.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              disabled={action.disabled}
              style={[styles.actionButton, action.disabled && { opacity: 0.5 }]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
            >
              {action.icon}
            </TouchableOpacity>
          ))}
        </HStack>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  leftContainer: {
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightContainer: {
    minWidth: 40,
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  titleAlignLeft: {
    alignItems: 'flex-start',
  },
  titleAlignCenter: {
    alignItems: 'center',
  },
});
