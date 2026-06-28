import { secureStorage } from './secureStorage';
import { supabase } from './supabase';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const TOKEN_EXPIRY_KEY = 'token_expiry';

type RefreshTokenCallback = (
  refreshToken: string
) => Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number }>;

let refreshHandler: RefreshTokenCallback | null = null;
let isRefreshingPromise: Promise<string | null> | null = null;

const provider = process.env.EXPO_PUBLIC_AUTH_PROVIDER || 'supabase';

/**
 * TokenManager: Bridges application request authorization with either Supabase
 * sessions or a Custom backend token system dynamically based on configuration.
 */
export const tokenManager = {
  /**
   * Register the refresh callback (used in custom mode).
   */
  registerRefreshHandler: (handler: RefreshTokenCallback) => {
    refreshHandler = handler;
  },

  /**
   * Save access token, refresh token, and calculate expiration timestamp (used in custom mode).
   */
  setTokens: async (
    accessToken: string,
    refreshToken: string,
    expiresInSeconds: number = 3600
  ): Promise<void> => {
    if (provider === 'supabase') return;

    try {
      const expiryTimestamp = Date.now() + expiresInSeconds * 1000;
      await secureStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      await secureStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      await secureStorage.setItem(TOKEN_EXPIRY_KEY, expiryTimestamp.toString());
    } catch (error) {
      console.error('TokenManager: Error setting tokens:', error);
    }
  },

  /**
   * Delete all tokens and expiration data.
   */
  clearTokens: async (): Promise<void> => {
    if (provider === 'supabase') {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('TokenManager: Error signing out from Supabase:', error);
      }
      return;
    }

    try {
      await secureStorage.removeItem(ACCESS_TOKEN_KEY);
      await secureStorage.removeItem(REFRESH_TOKEN_KEY);
      await secureStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('TokenManager: Error clearing tokens:', error);
    }
  },

  getAccessToken: async (): Promise<string | null> => {
    if (provider === 'supabase') {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token || null;
    }
    return await secureStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: async (): Promise<string | null> => {
    if (provider === 'supabase') {
      const { data } = await supabase.auth.getSession();
      return data.session?.refresh_token || null;
    }
    return await secureStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getExpiryTime: async (): Promise<number | null> => {
    if (provider === 'supabase') {
      const { data } = await supabase.auth.getSession();
      return data.session?.expires_at ? data.session.expires_at * 1000 : null;
    }
    const timeStr = await secureStorage.getItem(TOKEN_EXPIRY_KEY);
    return timeStr ? parseInt(timeStr, 10) : null;
  },

  /**
   * Evaluates if the stored access token has expired (with a 30-second clock-drift safety buffer).
   */
  isTokenExpired: async (): Promise<boolean> => {
    const expiry = await tokenManager.getExpiryTime();
    if (!expiry) return true;

    const buffer = 30 * 1000; // 30 seconds buffer
    return Date.now() + buffer >= expiry;
  },

  /**
   * Retrieves a valid access token.
   * - In Supabase mode, delegates to getSession() which auto-refreshes tokens.
   * - In Custom mode, checks if expired and uses the registered refresh handler.
   */
  getValidToken: async (): Promise<string | null> => {
    if (provider === 'supabase') {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('TokenManager: Error retrieving Supabase session:', error);
          return null;
        }
        return data.session?.access_token || null;
      } catch (error) {
        console.error('TokenManager: Exception fetching valid Supabase token:', error);
        return null;
      }
    }

    // Custom Mode
    try {
      const accessToken = await tokenManager.getAccessToken();
      const refreshToken = await tokenManager.getRefreshToken();

      if (!accessToken || !refreshToken) {
        return null;
      }

      const expired = await tokenManager.isTokenExpired();
      if (!expired) {
        return accessToken;
      }

      // If already refreshing, return the active refreshing promise
      if (isRefreshingPromise) {
        return await isRefreshingPromise;
      }

      if (!refreshHandler) {
        console.warn('TokenManager: Custom refresh handler not registered.');
        return null;
      }

      console.log('TokenManager: Custom token expired. Pre-emptively refreshing...');

      // Wrap the refresh in a promise to prevent duplicate concurrent refresh requests
      isRefreshingPromise = (async () => {
        try {
          const result = await refreshHandler!(refreshToken);
          const newAccess = result.accessToken;
          const newRefresh = result.refreshToken || refreshToken;
          const newExpiresIn = result.expiresIn || 3600;

          await tokenManager.setTokens(newAccess, newRefresh, newExpiresIn);
          return newAccess;
        } catch (err) {
          console.error('TokenManager: Failed to refresh custom token pre-emptively:', err);
          await tokenManager.clearTokens();
          return null;
        } finally {
          isRefreshingPromise = null;
        }
      })();

      return await isRefreshingPromise;
    } catch (error) {
      console.error('TokenManager: Error getting valid custom token:', error);
      return null;
    }
  },
};
