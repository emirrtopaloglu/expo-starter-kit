import * as SecureStore from 'expo-secure-store';

/**
 * SecureStorage utility for handling sensitive data operations.
 * Used for persisting sensitive data (e.g., auth tokens).
 */
export const secureStorage = {
  /**
   * Save a string value to secure storage.
   * @param key The key to save to.
   * @param value The value to save.
   */
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error setting secure item for key "${key}":`, error);
    }
  },

  /**
   * Retrieve a string value from secure storage.
   * @param key The key to retrieve.
   * @returns The value, or null if not found.
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error getting secure item for key "${key}":`, error);
      return null;
    }
  },

  /**
   * Remove an item from secure storage.
   * @param key The key to remove.
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing secure item for key "${key}":`, error);
    }
  },
};
