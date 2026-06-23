import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from './types';
import { createAuthSlice } from './slices/authSlice';
import { createUISlice } from './slices/uiSlice';
import { createNetworkSlice } from './slices/networkSlice';
import { createAppSlice } from './slices/appSlice';

// Export types so they can be consumed app-wide
export * from './types';

/**
 * Unified Zustand Store: Combines all state slices into a single store instance.
 * Implements persistent storage for auth and application preferences using AsyncStorage,
 * leaving volatile UI and Network states unpersisted.
 */
export const useStore = create<RootState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createUISlice(...args),
      ...createNetworkSlice(...args),
      ...createAppSlice(...args),
    }),
    {
      name: 'app-storage', // Consolidated storage key name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Selectively persist only critical credentials profile & preference data
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        items: state.items,
        language: state.language,
      }),
    }
  )
);
