import { useWindowDimensions } from 'react-native';

/**
 * A hook that returns the screen width, height, and a tablet layout flag.
 *
 * @returns Object containing dimensions and isTablet indicator.
 */
export function useScreenDimensions() {
  const { width, height } = useWindowDimensions();

  // A device is generally considered a tablet if the smallest dimension is >= 600dp
  const isTablet = Math.min(width, height) >= 600;

  return {
    width,
    height,
    isTablet,
  };
}
