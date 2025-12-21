export const colors = {
  // Brand Palette
  primary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6', // Purple Primary
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Neutral Scales (Grays/Slates)
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    50: '#F8FAFC', // Light Background
    100: '#F1F5F9',
    200: '#E2E8F0', // Border Light
    300: '#CBD5E1',
    400: '#94A3B8', // Placeholder
    500: '#64748B', // Body Text Light
    600: '#475569',
    700: '#334155', // Body Text Dark
    800: '#1E293B', // Surface Dark
    900: '#0F172A', // Background Dark
  },

  // Semantics
  success: {
    light: '#DCFCE7',
    main: '#22C55E',
    dark: '#14532D',
  },
  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#7F1D1D',
  },
  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#78350F',
  },
  info: {
    light: '#E0F2FE',
    main: '#3B82F6',
    dark: '#1E3A8A',
  },
} as const;
