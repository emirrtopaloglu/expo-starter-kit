/**
 * Type declarations for environment variables loaded by Expo.
 * Extends the global NodeJS.ProcessEnv namespace.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * Active environment name (e.g. 'development', 'production').
     */
    EXPO_PUBLIC_APP_ENV: 'development' | 'production' | 'staging';
    /**
     * Base URL for the Axios HTTP client.
     */
    EXPO_PUBLIC_API_URL: string;
    /**
     * API key for the backend service.
     */
    EXPO_PUBLIC_API_KEY?: string;
  }
}
