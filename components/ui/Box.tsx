import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Theme } from '@/theme';

export interface BoxProps extends ViewProps {
  bg?: keyof Theme['colors']['background'] | string;
  p?: keyof Theme['spacing'] | number;
  m?: keyof Theme['spacing'] | number;
  px?: keyof Theme['spacing'] | number;
  py?: keyof Theme['spacing'] | number;
  mx?: keyof Theme['spacing'] | number;
  my?: keyof Theme['spacing'] | number;
  mt?: keyof Theme['spacing'] | number;
  mb?: keyof Theme['spacing'] | number;
  ml?: keyof Theme['spacing'] | number;
  mr?: keyof Theme['spacing'] | number;
  pt?: keyof Theme['spacing'] | number;
  pb?: keyof Theme['spacing'] | number;
  pl?: keyof Theme['spacing'] | number;
  pr?: keyof Theme['spacing'] | number;
  rounded?: keyof Theme['radius'] | number;
  shadow?: keyof Theme['shadows'];
  children?: React.ReactNode;
}

/**
 * Box: The fundamental layout block.
 * Supports utility props for margin, padding, background, radius, shadow.
 */
export function Box({
  bg,
  p,
  m,
  px,
  py,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  pt,
  pb,
  pl,
  pr,
  rounded,
  shadow,
  style,
  children,
  ...props
}: BoxProps) {
  const { theme } = useTheme();

  const getSpacing = (val?: keyof Theme['spacing'] | number) => {
    if (val === undefined) return undefined;
    return typeof val === 'number' ? val : theme.spacing[val];
  };

  const getRadius = (val?: keyof Theme['radius'] | number) => {
    if (val === undefined) return undefined;
    return typeof val === 'number' ? val : theme.radius[val];
  };

  const getShadow = (val?: keyof Theme['shadows']) => {
    if (!val) return undefined;
    return theme.shadows[val];
  };

  // Resolve background color safely
  const getBackgroundColor = (val?: string) => {
    if (!val) return undefined;
    // Check if it's a key in theme.colors.background
    if (val in theme.colors.background) {
      return theme.colors.background[val as keyof Theme['colors']['background']];
    }
    return val;
  };

  const boxStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(bg as string),
    padding: getSpacing(p),
    margin: getSpacing(m),
    paddingHorizontal: getSpacing(px),
    paddingVertical: getSpacing(py),
    marginHorizontal: getSpacing(mx),
    marginVertical: getSpacing(my),
    marginTop: getSpacing(mt),
    marginBottom: getSpacing(mb),
    marginLeft: getSpacing(ml),
    marginRight: getSpacing(mr),
    paddingTop: getSpacing(pt),
    paddingBottom: getSpacing(pb),
    paddingLeft: getSpacing(pl),
    paddingRight: getSpacing(pr),
    borderRadius: getRadius(rounded),
    ...getShadow(shadow),
  };

  return (
    <View style={[boxStyle, style]} {...props}>
      {children}
    </View>
  );
}
