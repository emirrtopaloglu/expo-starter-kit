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
    /**
     * RevenueCat API Keys
     */
    EXPO_PUBLIC_REVENUECAT_APPLE_KEY?: string;
    EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY?: string;
    EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID?: string;
    /**
     * Supabase Connection Configuration
     */
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_KEY: string;
    /**
     * Active Authentication Provider
     */
    EXPO_PUBLIC_AUTH_PROVIDER: 'supabase' | 'custom';
  }
}
