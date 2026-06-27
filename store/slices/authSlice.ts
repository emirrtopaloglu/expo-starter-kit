import { StateCreator } from 'zustand';
import { AuthSlice, RootState } from '../types';
import { tokenManager } from '@/utils/tokenManager';
import { revenueCat } from '@/utils/revenueCat';

export const createAuthSlice: StateCreator<RootState, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  isAuthLoading: true,
  user: null,

  login: async (accessToken, refreshToken, expiresIn, user) => {
    set({ isAuthLoading: true });
    try {
      await tokenManager.setTokens(accessToken, refreshToken, expiresIn);
      set({ isAuthenticated: true, user, isAuthLoading: false });
      // Identify user in RevenueCat
      revenueCat.logIn(user.id);
    } catch (error) {
      console.error('AuthSlice: Login error:', error);
      set({ isAuthLoading: false });
    }
  },

  logout: async () => {
    set({ isAuthLoading: true });
    try {
      await tokenManager.clearTokens();
      set({ isAuthenticated: false, user: null, isAuthLoading: false });
      // Reset user identification in RevenueCat
      revenueCat.logOut();
    } catch (error) {
      console.error('AuthSlice: Logout error:', error);
      set({ isAuthLoading: false });
    }
  },

  initializeAuth: async () => {
    set({ isAuthLoading: true });
    try {
      const token = await tokenManager.getValidToken();
      if (token) {
        set({ isAuthenticated: true, isAuthLoading: false });
      } else {
        await tokenManager.clearTokens();
        set({ isAuthenticated: false, user: null, isAuthLoading: false });
      }
    } catch (error) {
      console.error('AuthSlice: Initialization error:', error);
      await tokenManager.clearTokens();
      set({ isAuthenticated: false, user: null, isAuthLoading: false });
    }
  },

  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
});
