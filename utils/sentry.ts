// Sentry Crash Reporting Configuration Template.
// To enable remote crash reporting:
// 1. Run: npx expo install @sentry/react-native
// 2. Add Sentry plugin configuration to app.json (see "//sentryPlugin" placeholder in app.json)
// 3. Uncomment the Sentry.init() block below and replace with your actual Sentry DSN.
// 4. Import this file in your root app/_layout.tsx file (e.g. import '@/utils/sentry';)

/*
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN_HERE', // Replace with your Sentry DSN from Sentry Dashboard
  debug: __DEV__, // Set to true to print debug details in development console
  environment: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions. Adjust in production.
  
  // Native crash reporting enabled in production
  enableNative: !__DEV__,
});
*/

/**
 * Log a non-fatal exception to Sentry (and the developer console).
 * Wires automatically into the GlobalErrorBoundary catch block.
 *
 * @param error The error object to report.
 * @param context Extra string tag to help organize errors.
 */
export const logError = (error: any, context?: string) => {
  console.error(`[Logged Error]${context ? ` (${context})` : ''}:`, error);

  /*
  // Uncomment when Sentry is initialized:
  Sentry.withScope((scope) => {
    if (context) {
      scope.setTag('context', context);
    }
    Sentry.captureException(error);
  });
  */
};

/**
 * Log a custom breadcrumb or info logs to Sentry.
 * Helps trace steps leading to a user crash.
 */
export const logInfo = (message: string, category?: string) => {
  console.log(`[Logged Info]${category ? ` (${category})` : ''}:`, message);

  /*
  // Uncomment when Sentry is initialized:
  Sentry.addBreadcrumb({
    category: category || 'info',
    message,
    level: 'info',
  });
  */
};
