import * as SecureStore from 'expo-secure-store';
import { biometrics } from './biometrics';

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

  /**
   * Save a sensitive string value to secure storage.
   * This is conceptually grouped for biometric lock gates.
   */
  setItemSecured: async (key: string, value: string): Promise<void> => {
    await secureStorage.setItem(key, value);
  },

  /**
   * Retrieve a sensitive string value from secure storage ONLY after successful biometric authentication.
   * @param key The key to retrieve.
   * @param promptMessage Prompt message presented during biometric scan.
   */
  getItemSecured: async (
    key: string,
    promptMessage: string = 'Please authenticate to access secure credentials'
  ): Promise<string | null> => {
    const isSupported = await biometrics.isSupported();
    if (!isSupported) {
      // Fallback: If biometrics is not enrolled/supported, return null to protect data,
      // or optionally fallback to default read depending on project requirements.
      // Here we log and return null as we want strict biometric gate check.
      console.warn('Biometrics: Not supported or enrolled. Denying secured storage read.');
      return null;
    }

    const authenticated = await biometrics.authenticate(promptMessage);
    if (!authenticated) {
      console.warn('Biometrics: Authentication failed. Denying secured storage read.');
      return null;
    }

    return await secureStorage.getItem(key);
  },
};

