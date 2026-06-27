import { useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderHeightContext } from '@react-navigation/elements';

/**
 * A hook that resolves the current navigation header height.
 * Combines React Navigation's context and safe area top notches.
 *
 * @returns Header height in pixels.
 */
export function useHeaderHeight(): number {
  const contextHeight = useContext(HeaderHeightContext);
  const insets = useSafeAreaInsets();

  // Fallback defaults if no navigator context is found:
  // standard header heights: Android 56, iOS 44 + status bar top inset
  const defaultHeader = 56;
  return contextHeight ?? insets.top + defaultHeader;
}
