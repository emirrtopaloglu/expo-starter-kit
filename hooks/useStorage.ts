import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/utils/storage';

/**
 * A hook that synchronizes state with AsyncStorage (similar to localStorage in web).
 *
 * @param key The storage key.
 * @param initialValue The default value if no stored value is found.
 * @returns A stateful value and a function to update it in both state and storage.
 */
export function useStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => Promise<void>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load the stored value on mount or when key changes
  useEffect(() => {
    const loadStored = async () => {
      try {
        const item = await storage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        } else {
          setStoredValue(initialValue);
        }
      } catch (error) {
        console.error(`useStorage: Error reading key "${key}"`, error);
      }
    };
    loadStored();
  }, [key, initialValue]);

  // Set the value in both React state and AsyncStorage
  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          storage.setItem(key, JSON.stringify(valueToStore)).catch((err) =>
            console.error(`useStorage: Error setting key "${key}"`, err)
          );
          return valueToStore;
        });
      } catch (error) {
        console.error(`useStorage: Error setting key "${key}"`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
