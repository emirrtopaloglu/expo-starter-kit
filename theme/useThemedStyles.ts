import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme } from './ThemeContext';
import { Theme } from './index';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useThemedStyles<T extends NamedStyles<T>>(stylesCallback: (theme: Theme) => T): T {
  const { theme } = useTheme();
  return useMemo(() => StyleSheet.create(stylesCallback(theme)), [theme, stylesCallback]);
}
