import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import { CheckCircle, XCircle, Info } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Theme } from '@/theme';

/**
 * Custom Toast component that mimics the look of 'react-hot-toast'.
 * Supports Dark Mode.
 */
const CustomToast = ({
  text1,
  text2,
  type,
}: {
  text1?: string;
  text2?: string;
  type: 'success' | 'error' | 'info';
}) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <CheckCircle
            size={24}
            color={theme.colors.success.main}
            fill={isDark ? theme.colors.success.dark : theme.colors.success.light}
          />
        );
      case 'error':
        return (
          <XCircle
            size={24}
            color={theme.colors.error.main}
            fill={isDark ? theme.colors.error.dark : theme.colors.error.light}
          />
        );
      case 'info':
        return (
          <Info
            size={24}
            color={theme.colors.info.main}
            fill={isDark ? theme.colors.info.dark : theme.colors.info.light}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.textContainer}>
        {text1 ? <Text style={styles.title}>{text1}</Text> : null}
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  );
};

export const toastConfig = {
  success: (props: BaseToastProps) => <CustomToast {...props} type="success" />,
  error: (props: BaseToastProps) => <CustomToast {...props} type="error" />,
  info: (props: BaseToastProps) => <CustomToast {...props} type="info" />,
};

const getStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      backgroundColor: theme.colors.background.paper,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.full,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 6,
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    iconContainer: {
      marginRight: theme.spacing.sm,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: '600',
      fontFamily: theme.typography.families.semibold,
      color: theme.colors.text.default,
    },
    message: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.regular,
      color: theme.colors.text.subtle,
      marginTop: 2,
    },
  });
};
