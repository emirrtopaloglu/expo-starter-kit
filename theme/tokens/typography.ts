import { TextStyle } from 'react-native';

const families = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

export const typography = {
  families,

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,

  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  } as const,

  variants: {
    h1: { fontSize: 36, fontFamily: families.bold, lineHeight: 40 } as TextStyle,
    h2: { fontSize: 30, fontFamily: families.bold, lineHeight: 36 } as TextStyle,
    h3: { fontSize: 24, fontFamily: families.semibold, lineHeight: 32 } as TextStyle,
    h4: { fontSize: 20, fontFamily: families.semibold, lineHeight: 28 } as TextStyle,
    body: { fontSize: 16, fontFamily: families.regular, lineHeight: 24 } as TextStyle,
    bodySmall: {
      fontSize: 14,
      fontFamily: families.regular,
      lineHeight: 20,
    } as TextStyle,
    caption: {
      fontSize: 12,
      fontFamily: families.regular,
      lineHeight: 16,
    } as TextStyle,
    button: { fontSize: 16, fontFamily: families.semibold } as TextStyle,
  },
};

