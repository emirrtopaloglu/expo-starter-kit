import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/storage-keys";

type ThemePreference = "light" | "dark" | "system";
type ThemeType = "light" | "dark";

interface ThemeContextType {
  themePreference: ThemePreference;
  activeTheme: ThemeType;
  setThemePreference: (theme: ThemePreference) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemeState] = useState<ThemePreference>("system");

  // Load saved preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await storage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme) {
        setThemeState(savedTheme as ThemePreference);
      }
    };
    loadTheme();
  }, []);

  const setThemePreference = async (theme: ThemePreference) => {
    setThemeState(theme);
    await storage.setItem(STORAGE_KEYS.THEME, theme);
  };

  // Determine the effective theme
  const activeTheme: ThemeType =
    themePreference === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themePreference;

  return (
    <ThemeContext.Provider
      value={{ themePreference, activeTheme, setThemePreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
