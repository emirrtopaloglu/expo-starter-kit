import { StateCreator } from 'zustand';
import { AuthSlice, RootState } from '../types';
import { supabase } from '@/utils/supabase';
import { authService } from '@/api/services/authService';
import { tokenManager } from '@/utils/tokenManager';
import { revenueCat } from '@/utils/revenueCat';

const provider = process.env.EXPO_PUBLIC_AUTH_PROVIDER || 'supabase';

export const createAuthSlice: StateCreator<RootState, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  isAuthLoading: true,
  user: null,

  login: async (email, password) => {
    set({ isAuthLoading: true });

    if (provider === 'supabase') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        set({ isAuthLoading: false });
        throw error;
      }
      return;
    }

    // Custom Mode
    try {
      const res = await authService.login(email, password);
      await tokenManager.setTokens(res.accessToken, res.refreshToken, res.expiresIn);
      set({
        isAuthenticated: true,
        user: res.user,
        isAuthLoading: false,
      });
      revenueCat.logIn(res.user.id);
    } catch (error) {
      set({ isAuthLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isAuthLoading: true });

    if (provider === 'supabase') {
      const { error } = await supabase.auth.signOut();
      if (error) {
        set({ isAuthLoading: false });
        throw error;
      }
      return;
    }

    // Custom Mode
    try {
      await authService.logout();
      await tokenManager.clearTokens();
      set({
        isAuthenticated: false,
        user: null,
        isAuthLoading: false,
      });
      revenueCat.logOut();
    } catch (error) {
      set({ isAuthLoading: false });
      throw error;
    }
  },

  register: async (email, password, name) => {
    set({ isAuthLoading: true });

    if (provider === 'supabase') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      set({ isAuthLoading: false });
      if (error) throw error;
      return;
    }

    // Custom Mode (Simulated)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      set({ isAuthLoading: false });
    } catch (error) {
      set({ isAuthLoading: false });
      throw error;
    }
  },

  resetPassword: async (email) => {
    set({ isAuthLoading: true });

    if (provider === 'supabase') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'expo-starter-kit://reset-password',
      });
      set({ isAuthLoading: false });
      if (error) throw error;
      return;
    }

    // Custom Mode (Simulated)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      set({ isAuthLoading: false });
    } catch (error) {
      set({ isAuthLoading: false });
      throw error;
    }
  },

  initializeAuth: async () => {
    set({ isAuthLoading: true });

    if (provider === 'supabase') {
      try {
        supabase.auth.onAuthStateChange(async (event, session) => {
          console.log(`AuthSlice: Supabase auth state change: ${event}`);
          if (session?.user) {
            const userProfile = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            };
            set({
              isAuthenticated: true,
              user: userProfile,
              isAuthLoading: false,
            });
            revenueCat.logIn(session.user.id);
          } else {
            set({
              isAuthenticated: false,
              user: null,
              isAuthLoading: false,
            });
            revenueCat.logOut();
          }
        });
      } catch (error) {
        console.error('AuthSlice: Initialization error:', error);
        set({ isAuthenticated: false, user: null, isAuthLoading: false });
      }
      return;
    }

    // Custom Mode
    try {
      const token = await tokenManager.getValidToken();
      if (token) {
        // Retrieve mock user session profile
        set({
          isAuthenticated: true,
          user: { id: 'usr_1001', email: 'admin@starter.kit', name: 'Admin User' },
          isAuthLoading: false,
        });
      } else {
        await tokenManager.clearTokens();
        set({ isAuthenticated: false, user: null, isAuthLoading: false });
      }
    } catch (error) {
      console.error('AuthSlice: Custom initialization error:', error);
      await tokenManager.clearTokens();
      set({ isAuthenticated: false, user: null, isAuthLoading: false });
    }
  },

  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
});
