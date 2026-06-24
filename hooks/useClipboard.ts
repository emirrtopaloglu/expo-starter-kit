import { useState, useCallback, useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';

/**
 * A hook that exposes clipboard copy/paste and value syncing actions.
 *
 * @returns clipboard value, copy function, and paste function.
 */
export function useClipboard() {
  const [value, setValue] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setValue(text);
    } catch (error) {
      console.error('useClipboard: Error copying to clipboard', error);
    }
  }, []);

  const paste = useCallback(async () => {
    try {
      const text = await Clipboard.getStringAsync();
      setValue(text);
      return text;
    } catch (error) {
      console.error('useClipboard: Error pasting from clipboard', error);
      return null;
    }
  }, []);

  useEffect(() => {
    Clipboard.getStringAsync()
      .then((text) => setValue(text))
      .catch(() => {});
  }, []);

  return { value, copy, paste };
}
