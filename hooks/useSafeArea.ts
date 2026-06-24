import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';

/**
 * A hook that returns the safe area edge insets directly.
 *
 * @returns Safe areaEdgeInsets.
 */
export function useSafeArea(): EdgeInsets {
  return useSafeAreaInsets();
}
