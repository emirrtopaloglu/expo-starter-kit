import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

/**
 * A hook that monitors keyboard visibility states and height dimensions.
 *
 * @returns keyboardHeight (in pixels) and isKeyboardVisible flag.
 */
export function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { keyboardHeight, isKeyboardVisible };
}
