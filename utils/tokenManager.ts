import { secureStorage } from './secureStorage';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const TOKEN_EXPIRY_KEY = 'token_expiry';

type RefreshTokenCallback = (
  refreshToken: string
) => Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number }>;

let refreshHandler: RefreshTokenCallback | null = null;
let isRefreshingPromise: Promise<string | null> | null = null;

/**
 * TokenManager: Utility to securely store, retrieve, and evaluate JWT tokens and expiration.
 * Gated with pre-emptive automatic token renewal.
 */
export const tokenManager = {
  /**
   * Register the refresh callback to prevent circular dependencies.
   * Typically registered by the Auth Service.
   */
  registerRefreshHandler: (handler: RefreshTokenCallback) => {
    refreshHandler = handler;
  },

  /**
   * Save access token, refresh token, and calculate expiration timestamp.
   * @param accessToken JWT Access Token
   * @param refreshToken JWT Refresh Token
   * @param expiresInSeconds Expiration lifespan in seconds (e.g., 3600)
   */
  setTokens: async (
    accessToken: string,
    refreshToken: string,
    expiresInSeconds: number = 3600
  ): Promise<void> => {
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
   * Delete all tokens and expiration data from secure storage.
   */
  clearTokens: async (): Promise<void> => {
    try {
      await secureStorage.removeItem(ACCESS_TOKEN_KEY);
      await secureStorage.removeItem(REFRESH_TOKEN_KEY);
      await secureStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('TokenManager: Error clearing tokens:', error);
    }
  },

  getAccessToken: async (): Promise<string | null> => {
    return await secureStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: async (): Promise<string | null> => {
    return await secureStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getExpiryTime: async (): Promise<number | null> => {
    const timeStr = await secureStorage.getItem(TOKEN_EXPIRY_KEY);
    return timeStr ? parseInt(timeStr, 10) : null;
  },

  /**
   * Evaluates if the stored access token has expired (with a 30-second clock-drift safety buffer).
   */
  isTokenExpired: async (): Promise<boolean> => {
    const expiry = await tokenManager.getExpiryTime();
    if (!expiry) return true; // No expiry timestamp means expired/invalid

    const buffer = 30 * 1000; // 30 seconds buffer
    return Date.now() + buffer >= expiry;
  },

  /**
   * Retrieves a valid access token.
   * If the current token is expired, it pre-emptively calls the registered refresh handler,
   * saves the refreshed tokens, and returns the new token.
   */
  getValidToken: async (): Promise<string | null> => {
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
        console.warn('TokenManager: Refresh handler not registered.');
        return null;
      }

      console.log('TokenManager: Token expired. Pre-emptively refreshing...');

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
          console.error('TokenManager: Failed to refresh token pre-emptively:', err);
          await tokenManager.clearTokens();
          return null;
        } finally {
          isRefreshingPromise = null;
        }
      })();

      return await isRefreshingPromise;
    } catch (error) {
      console.error('TokenManager: Error getting valid token:', error);
      return null;
    }
  },
};
