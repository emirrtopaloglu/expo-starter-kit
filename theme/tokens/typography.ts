import { TextStyle } from 'react-native';

export const typography = {
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
    h1: { fontSize: 36, fontFamily: 'PlusJakartaSans_700Bold', lineHeight: 40 } as TextStyle,
    h2: { fontSize: 30, fontFamily: 'PlusJakartaSans_700Bold', lineHeight: 36 } as TextStyle,
    h3: { fontSize: 24, fontFamily: 'PlusJakartaSans_600SemiBold', lineHeight: 32 } as TextStyle,
    h4: { fontSize: 20, fontFamily: 'PlusJakartaSans_600SemiBold', lineHeight: 28 } as TextStyle,
    body: { fontSize: 16, fontFamily: 'PlusJakartaSans_400Regular', lineHeight: 24 } as TextStyle,
    bodySmall: {
      fontSize: 14,
      fontFamily: 'PlusJakartaSans_400Regular',
      lineHeight: 20,
    } as TextStyle,
    caption: {
      fontSize: 12,
      fontFamily: 'PlusJakartaSans_400Regular',
      lineHeight: 16,
    } as TextStyle,
    button: { fontSize: 16, fontFamily: 'PlusJakartaSans_600SemiBold' } as TextStyle,
  },
};
