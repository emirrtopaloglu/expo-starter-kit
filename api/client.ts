import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from '@/utils/tokenManager';
import { useStore } from '@/store';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track whether the token is currently being refreshed in response interceptor
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

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
// Pre-emptively checks token expiration and fetches/refreshes it prior to sending.
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // getValidToken will automatically run pre-emptive refresh if expired
      const token = await tokenManager.getValidToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('API Client: Request interceptor token retrieval failed:', error);
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
// Serves as a fallback 401 handler for server-side token revocations.
client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
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
        // Trigger tokenManager validation check/refresh
        const newAccessToken = await tokenManager.getValidToken();
        if (!newAccessToken) {
          throw new Error('API Client: Server-side token refresh rejected.');
        }

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh token flow failed -> Clear storage and logout user globally
        await tokenManager.clearTokens();
        useStore.getState().logout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
