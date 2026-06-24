import { logError } from './sentry';

const isDev = __DEV__;

/**
 * Local Logger: Environment-aware logger utility.
 * Prints debugging console logs during development, and delegates
 * error exceptions directly to Sentry in production mode.
 */
export const logger = {
  /**
   * Log debug info to console in development.
   */
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Log general info to console in development.
   */
  info: (...args: unknown[]) => {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Log warnings to console globally.
   */
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Log error details to console, and forward to Sentry when in production.
   *
   * @param error The error exception or message.
   * @param context Extra string tag context details.
   */
  error: (error: unknown, context?: string) => {
    console.error('[ERROR]', context, error);
    if (!isDev) {
      logError(error, context);
    }
  },
};
