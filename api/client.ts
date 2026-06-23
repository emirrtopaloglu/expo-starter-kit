import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from '@/utils/secureStorage';
import { useStore } from '@/store/useStore';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track whether the token is currently being refreshed
let isRefreshing = false;

// Queue to hold failed requests while the token is being refreshed
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

/**
 * Resolves or rejects all requests in the queue.
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// ==========================================
// Request Interceptor
// ==========================================
// Automatically retrieves the access token from SecureStore and injects it.
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await secureStorage.getItem(ACCESS_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading access token from secure storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// Response Interceptor
// ==========================================
// Automatically intercepts 401 errors, triggers the refresh token flow,
// queues overlapping requests, and logs the user out if refreshing fails.
client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we are already refreshing the token, enqueue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(client(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh token endpoint (using a separate clean axios call to prevent interceptor loop)
        const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken =
          refreshResponse.data?.accessToken || refreshResponse.data?.access_token;
        const newRefreshToken =
          refreshResponse.data?.refreshToken || refreshResponse.data?.refresh_token;

        if (!newAccessToken) {
          throw new Error('Refresh token request failed to return a new access token');
        }

        // Update tokens in secure storage
        await secureStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        if (newRefreshToken) {
          await secureStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        }

        // Process all queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return client(originalRequest);
      } catch (refreshError) {
        // Refresh token flow failed (e.g. expired or invalid) -> Log out user and reject queue
        processQueue(refreshError, null);

        try {
          await secureStorage.removeItem(ACCESS_TOKEN_KEY);
          await secureStorage.removeItem(REFRESH_TOKEN_KEY);
        } catch (storageErr) {
          console.error('Error clearing tokens from secure storage:', storageErr);
        }

        // Log out the user globally via Zustand store
        useStore.getState().setLoggedIn(false);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
