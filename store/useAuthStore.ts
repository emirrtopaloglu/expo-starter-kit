import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager } from '@/utils/tokenManager';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    user: User
  ) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

/**
 * Persisted Zustand store for Auth operations.
 * Stores user details and authentication status persistently.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,

      login: async (accessToken, refreshToken, expiresIn, user) => {
        set({ isLoading: true });
        try {
          await tokenManager.setTokens(accessToken, refreshToken, expiresIn);
          set({ isAuthenticated: true, user, isLoading: false });
        } catch (error) {
          console.error('AuthStore: Login error:', error);
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await tokenManager.clearTokens();
          set({ isAuthenticated: false, user: null, isLoading: false });
        } catch (error) {
          console.error('AuthStore: Logout error:', error);
          set({ isLoading: false });
        }
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          // pre-emptively try to resolve a valid token
          const token = await tokenManager.getValidToken();
          if (token) {
            set({ isAuthenticated: true, isLoading: false });
          } else {
            // No valid token available (expired or cleared) -> Force logout
            await tokenManager.clearTokens();
            set({ isAuthenticated: false, user: null, isLoading: false });
          }
        } catch (error) {
          console.error('AuthStore: Initialization error:', error);
          await tokenManager.clearTokens();
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-state-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }), // Only persist user info and authentication status.
    }
  )
);
