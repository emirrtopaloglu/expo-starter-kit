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
    h1: { fontSize: 36, fontWeight: '700', lineHeight: 40 } as TextStyle,
    h2: { fontSize: 30, fontWeight: '700', lineHeight: 36 } as TextStyle,
    h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 } as TextStyle,
    h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 } as TextStyle,
    body: { fontSize: 16, fontWeight: '400', lineHeight: 24 } as TextStyle,
    bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 } as TextStyle,
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 } as TextStyle,
    button: { fontSize: 16, fontWeight: '600' } as TextStyle,
  },
};
