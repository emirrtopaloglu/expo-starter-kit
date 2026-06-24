/**
 * Formatting helper utilities.
 * Handles dates, currencies, numbers, phone formats, file sizes, masking, and string truncations.
 */

/**
 * Formats a date using Intl.DateTimeFormat with a safe fallback.
 *
 * @param date The date input (Date object, timestamp, or ISO string).
 * @param options Intl.DateTimeFormatOptions configuration.
 * @param locale The locale to format with (defaults to 'en-US').
 */
export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
  locale = 'en-US'
): string => {
  try {
    const d = typeof date === 'object' ? date : new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch (error) {
    console.error('formatDate error:', error);
    return String(date);
  }
};

/**
 * Formats a date/timestamp to a relative humanized string (e.g. "just now", "10m ago", "2d ago").
 *
 * @param date The past or future date to evaluate.
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  try {
    const d = typeof date === 'object' ? date : new Date(date);
    if (isNaN(d.getTime())) return '';

    const now = Date.now();
    const diff = now - d.getTime();
    const isFuture = diff < 0;
    const absDiff = Math.abs(diff);

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) return 'just now';

    if (minutes < 60) {
      return isFuture ? `in ${minutes}m` : `${minutes}m ago`;
    }
    if (hours < 24) {
      return isFuture ? `in ${hours}h` : `${hours}h ago`;
    }
    if (days < 30) {
      return isFuture ? `in ${days}d` : `${days}d ago`;
    }
    if (months < 12) {
      return isFuture ? `in ${months}mo` : `${months}mo ago`;
    }
    return isFuture ? `in ${years}yr` : `${years}yr ago`;
  } catch (error) {
    return '';
  }
};

/**
 * Formats numeric values to currency strings.
 *
 * @param value The numeric value.
 * @param currency The ISO 4217 currency code (e.g. 'USD', 'TRY').
 * @param locale The locale string.
 */
export const formatCurrency = (value: number, currency = 'USD', locale = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  } catch (error) {
    return `${currency} ${value.toFixed(2)}`;
  }
};

/**
 * Formats decimal and integer representations.
 *
 * @param value The numeric value.
 * @param locale The locale string.
 */
export const formatNumber = (value: number, locale = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch (error) {
    return String(value);
  }
};

/**
 * Formats large numbers compactly (e.g., 1.2K, 3.4M).
 *
 * @param value The numeric value.
 * @param locale The locale string.
 */
export const formatCompactNumber = (value: number, locale = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  } catch (error) {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return String(value);
  }
};

/**
 * Converts byte counts into human-readable file size strings (e.g., 12.4 MB).
 *
 * @param bytes The raw bytes value.
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Standardizes raw digits into a (XXX) XXX-XXXX phone layout.
 *
 * @param phone Raw phone number digits string.
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Masks credit card numbers, showing only the final 4 digits.
 *
 * @param cardNumber Credit card digits string.
 */
export const maskCard = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s?/g, '');
  if (cleaned.length < 4) return cleaned;
  const last4Digits = cleaned.slice(-4);
  return '•••• •••• •••• ' + last4Digits;
};

/**
 * Truncates strings with suffix fallback.
 *
 * @param text Original string content.
 * @param maxLength Total character allowance before truncation.
 * @param suffix Truncation sign suffix (defaults to '...').
 */
export const truncate = (text: string, maxLength: number, suffix = '...'): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param text The string to capitalize.
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
