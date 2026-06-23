import { tokenManager } from '@/utils/tokenManager';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * AuthService: Handles authentication requests.
 * Uses mock latency to simulate network calls in the boilerplate,
 * allowing instant testability without a backend.
 */
export const authService = {
  /**
   * Mock user login.
   * Accepts credentials (admin@starter.kit / password123) and returns mock JWTs
   * set to expire in 60 seconds to easily demonstrate token refresh cycles.
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === 'admin@starter.kit' && password === 'password123') {
          resolve({
            accessToken: `mock_access_jwt_${Date.now()}`,
            refreshToken: `mock_refresh_jwt_${Date.now()}`,
            expiresIn: 60, // 60 seconds lifespan for easy refresh testing
            user: {
              id: 'usr_1001',
              email: 'admin@starter.kit',
              name: 'Admin User',
            },
          });
        } else {
          reject(new Error('Invalid email or password. Use: admin@starter.kit / password123'));
        }
      }, 1000);
    });
  },

  /**
   * Mock token refresh endpoint.
   * Generates new access and refresh tokens.
   */
  refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (refreshToken.startsWith('mock_refresh_jwt_')) {
          resolve({
            accessToken: `mock_access_jwt_${Date.now()}`,
            refreshToken: `mock_refresh_jwt_${Date.now()}`,
            expiresIn: 60, // refreshes expire in 60 seconds as well
          });
        } else {
          reject(new Error('Invalid refresh token'));
        }
      }, 800);
    });
  },

  /**
   * Mock logout API call.
   */
  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
};

// Register refresh handler into the TokenManager to resolve circular dependencies
tokenManager.registerRefreshHandler(async (token) => {
  console.log('AuthService: Executing token renewal endpoint via TokenManager handler');
  const res = await authService.refreshToken(token);
  return {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    expiresIn: res.expiresIn,
  };
});
