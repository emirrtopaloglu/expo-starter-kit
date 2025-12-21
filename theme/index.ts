import { colors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { typography } from './tokens/typography';
import { radius, shadows } from './tokens/layout';

export type Theme = typeof lightTheme | typeof darkTheme;

export const lightTheme = {
  mode: 'light',
  colors: {
    ...colors,
    background: {
      default: colors.neutral[50],
      paper: colors.neutral.white,
      subtle: colors.neutral[100],
    },
    text: {
      default: colors.neutral[900],
      subtle: colors.neutral[500],
      inverse: colors.neutral.white,
    },
    border: colors.neutral[200],
    primary: colors.primary[500], // Default primary
  },
  spacing,
  typography,
  radius,
  shadows,
} as const;

export const darkTheme = {
  ...lightTheme,
  mode: 'dark',
  colors: {
    ...colors,
    background: {
      default: colors.neutral[900],
      paper: colors.neutral[800],
      subtle: colors.neutral[800],
    },
    text: {
      default: colors.neutral[50], // Light Text
      subtle: colors.neutral[400],
      inverse: colors.neutral[900],
    },
    border: colors.neutral[700],
    primary: colors.primary[400], // Slightly lighter for dark mode visibility
  },
  // Shadows need special handling in dark mode (often handled via elevation or simpler borders)
  shadows: {
    ...shadows,
    sm: { ...shadows.sm, shadowColor: '#000', shadowOpacity: 0.3 },
    md: { ...shadows.md, shadowColor: '#000', shadowOpacity: 0.4 },
    lg: { ...shadows.lg, shadowColor: '#000', shadowOpacity: 0.5 },
  },
} as const;
