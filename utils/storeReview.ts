import * as StoreReview from 'expo-store-review';

/**
 * storeReview: Wrapper for expo-store-review to request in-app ratings
 * without redirecting users to the App Store / Play Store.
 */
export const storeReview = {
  /**
   * Check if store review is supported on the current device and OS version.
   */
  isAvailable: async (): Promise<boolean> => {
    try {
      return await StoreReview.isAvailableAsync();
    } catch (error) {
      console.error('StoreReview: Error checking availability:', error);
      return false;
    }
  },

  /**
   * Request an in-app review/rating dialog if available.
   * If it is not available, returns false.
   */
  requestReview: async (): Promise<boolean> => {
    try {
      const available = await StoreReview.isAvailableAsync();
      if (!available) {
        console.log('StoreReview: Rating dialog is not available on this device');
        return false;
      }

      await StoreReview.requestReview();
      return true;
    } catch (error) {
      console.error('StoreReview: Error requesting review:', error);
      return false;
    }
  },
};
