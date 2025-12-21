import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { lightTheme, darkTheme, Theme } from './index';
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
} from '@react-navigation/native';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemeState] = useState<ThemePreference>('system');

  // Load saved preference
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await storage.getItem(STORAGE_KEYS.THEME);
      if (saved) setThemeState(saved as ThemePreference);
    };
    loadTheme();
  }, []);

  const setThemePreference = async (pref: ThemePreference) => {
    setThemeState(pref);
    await storage.setItem(STORAGE_KEYS.THEME, pref);
  };

  const isDark =
    themePreference === 'system' ? systemColorScheme === 'dark' : themePreference === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  // React Navigation Theme Logic
  const navTheme = isDark ? NavDarkTheme : NavDefaultTheme;
  const combinedNavTheme = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      background: theme.colors.background.default,
      text: theme.colors.text.default,
      card: theme.colors.background.paper,
      border: theme.colors.border.default,
      primary: theme.colors.primary,
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, themePreference, setThemePreference, isDark }}>
      <NavigationThemeProvider value={combinedNavTheme}>{children}</NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context; // Returns everything: theme object, preference setter, isDark boolean
}
