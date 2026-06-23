import { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Updates from 'expo-updates';
import { create } from 'zustand';

interface UpdateState {
  isUpdateAvailable: boolean;
  isUpdateDownloading: boolean;
  updateError: string | null;
  isSimulated: boolean;
  setUpdateAvailable: (available: boolean) => void;
  setUpdateDownloading: (downloading: boolean) => void;
  setUpdateError: (error: string | null) => void;
  setSimulated: (simulated: boolean) => void;
}

// Global store to keep update state synchronized across components and screen layout
export const useUpdateStore = create<UpdateState>((set) => ({
  isUpdateAvailable: false,
  isUpdateDownloading: false,
  updateError: null,
  isSimulated: false,
  setUpdateAvailable: (available) => set({ isUpdateAvailable: available }),
  setUpdateDownloading: (downloading) => set({ isUpdateDownloading: downloading }),
  setUpdateError: (error) => set({ updateError: error }),
  setSimulated: (simulated) => set({ isSimulated: simulated }),
}));

/**
 * A custom hook to manage expo-updates (EAS Update).
 * Handles checking for updates in the background, downloading them,
 * and reloading the application. Also supports simulated updates for development.
 */
export function useAppUpdate() {
  const {
    isUpdateAvailable,
    isUpdateDownloading,
    updateError,
    isSimulated,
    setUpdateAvailable,
    setUpdateDownloading,
    setUpdateError,
    setSimulated,
  } = useUpdateStore();

  const checkForUpdate = useCallback(async () => {
    // If update simulation is active, skip real checks
    if (isSimulated || __DEV__) {
      if (isUpdateAvailable) return;
    }

    if (!Updates.isEnabled) {
      console.log('AppUpdate: Updates are disabled (typical in Expo Go / Dev Client)');
      return;
    }

    try {
      setUpdateError(null);
      const updateCheck = await Updates.checkForUpdateAsync();

      if (updateCheck.isAvailable) {
        setUpdateDownloading(true);
        const fetchResult = await Updates.fetchUpdateAsync();
        
        if (fetchResult.isNew) {
          setUpdateAvailable(true);
        }
      }
    } catch (error: any) {
      console.error('AppUpdate: Error checking/fetching update:', error);
      setUpdateError(error?.message || 'Failed to fetch update.');
    } finally {
      setUpdateDownloading(false);
    }
  }, [isSimulated, isUpdateAvailable, setUpdateAvailable, setUpdateDownloading, setUpdateError]);

  const runUpdate = useCallback(async () => {
    if (isSimulated) {
      console.log('AppUpdate: Simulated update reload triggered');
      // Reset simulation state
      setUpdateAvailable(false);
      setSimulated(false);
      // Relaunch app simulation (in Dev, we can reload or simulate it)
      await Updates.reloadAsync();
      return;
    }

    if (!Updates.isEnabled) {
      console.log('AppUpdate: Updates disabled, cannot reload updates');
      return;
    }

    try {
      await Updates.reloadAsync();
    } catch (error: any) {
      console.error('AppUpdate: Error reloading update:', error);
      setUpdateError(error?.message || 'Failed to reload app.');
    }
  }, [isSimulated, setUpdateAvailable, setSimulated, setUpdateError]);

  const triggerSimulatedUpdate = useCallback(() => {
    setSimulated(true);
    setUpdateAvailable(true);
  }, [setSimulated, setUpdateAvailable]);

  const clearUpdateState = useCallback(() => {
    setUpdateAvailable(false);
    setUpdateDownloading(false);
    setUpdateError(null);
    setSimulated(false);
  }, [setUpdateAvailable, setUpdateDownloading, setUpdateError, setSimulated]);

  // Check on mount and also when app comes back to foreground
  useEffect(() => {
    checkForUpdate();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkForUpdate();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [checkForUpdate]);

  return {
    isUpdateAvailable,
    isUpdateDownloading,
    updateError,
    isSimulated,
    checkForUpdate,
    runUpdate,
    triggerSimulatedUpdate,
    clearUpdateState,
  };
}
