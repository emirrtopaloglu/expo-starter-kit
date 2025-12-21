import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { StatusBar, StatusBarProps } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeContext';

interface ScreenProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  safeAreaEdges?: SafeAreaViewProps['edges'];
  backgroundColor?: string;
  statusBarStyle?: StatusBarProps['style'];
  preset?: 'fixed' | 'scroll' | 'auto';
  keyboardOffset?: number;
}

export const Screen = ({
  children,
  style,
  contentContainerStyle,
  safeAreaEdges,
  backgroundColor,
  statusBarStyle,
  preset = 'fixed',
  keyboardOffset = 0,
}: ScreenProps) => {
  const { theme, isDark } = useTheme();

  const bg = backgroundColor || theme.colors.background.default;
  const statusItems = statusBarStyle || (isDark ? 'light' : 'dark');

  const Wrapper = safeAreaEdges ? SafeAreaView : View;

  // Base props for wrapper (safeara or view)
  const wrapperProps = safeAreaEdges
    ? { edges: safeAreaEdges, style: [{ flex: 1, backgroundColor: bg }, style] }
    : { style: [{ flex: 1, backgroundColor: bg }, style] };

  // Keyboard behavior
  const behavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <Wrapper {...(wrapperProps as any)}>
      <StatusBar style={statusItems} backgroundColor={bg} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={behavior}
        keyboardVerticalOffset={keyboardOffset}
      >
        {preset === 'scroll' ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={contentContainerStyle}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1 }, contentContainerStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </Wrapper>
  );
};
