import Purchases, { LOG_LEVEL, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';
import { logger } from './logger';

const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID || 'premium';

type PremiumListener = (premium: boolean) => void;
let premiumListener: PremiumListener | null = null;

export const revenueCat = {
  /**
   * Set a listener callback to update global premium status when it changes.
   * This is used to break the require circular dependency between utility and store modules.
   */
  setPremiumListener: (listener: PremiumListener) => {
    premiumListener = listener;
  },

  /**
   * Initialize the RevenueCat Purchases SDK.
   * Called once at application startup.
   */
  initialize: async (): Promise<void> => {
    try {
      if (Platform.OS === 'web') return;

      // Set logs level to debug in development mode
      if (__DEV__) {
        await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      } else {
        await Purchases.setLogLevel(LOG_LEVEL.ERROR);
      }

      const apiKey = Platform.select({
        ios: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY,
        android: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY,
      });

      if (!apiKey || apiKey.includes('placeholder')) {
        logger.warn(
          'RevenueCat API key is missing or is placeholder. SDK initialization bypassed.'
        );
        return;
      }

      await Purchases.configure({ apiKey });
      logger.info('RevenueCat SDK configured successfully');

      // Sync entitlement status on startup
      await revenueCat.syncEntitlementStatus();
    } catch (err) {
      logger.error(err, 'Failed to configure RevenueCat Purchases SDK');
    }
  },

  /**
   * Sync active subscription entitlements with Zustand global store state.
   */
  syncEntitlementStatus: async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') return false;

      // Check if SDK has been configured
      const isConfigured = await Purchases.isConfigured();
      if (!isConfigured) return false;

      const customerInfo = await Purchases.getCustomerInfo();
      const hasActiveEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      // Update via listener callback
      if (premiumListener) {
        premiumListener(hasActiveEntitlement);
      }
      logger.info(`Zustand premium status updated. isPremium: ${hasActiveEntitlement}`);

      return hasActiveEntitlement;
    } catch (err) {
      logger.error(err, 'Failed to sync RevenueCat entitlements');
      return false;
    }
  },

  /**
   * Identify a user in RevenueCat upon authentication.
   */
  logIn: async (userId: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') return;

      const isConfigured = await Purchases.isConfigured();
      if (!isConfigured) return;

      await Purchases.logIn(userId);
      logger.info(`Identified user ${userId} in RevenueCat`);
      await revenueCat.syncEntitlementStatus();
    } catch (err) {
      logger.error(err, `Failed to log in user ${userId} in RevenueCat`);
    }
  },

  /**
   * Reset the user identification in RevenueCat upon logout.
   */
  logOut: async (): Promise<void> => {
    try {
      if (Platform.OS === 'web') return;

      const isConfigured = await Purchases.isConfigured();
      if (!isConfigured) return;

      await Purchases.logOut();
      logger.info('User logged out from RevenueCat');
      if (premiumListener) {
        premiumListener(false);
      }
    } catch (err) {
      logger.error(err, 'Failed to log out user from RevenueCat');
    }
  },

  /**
   * Fetch configured offerings (products) available for purchase.
   */
  fetchActiveOfferings: async (): Promise<PurchasesOffering | null> => {
    try {
      if (Platform.OS === 'web') return null;

      const isConfigured = await Purchases.isConfigured();
      if (!isConfigured) return null;

      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        return offerings.current;
      }
      return null;
    } catch (err) {
      logger.error(err, 'Failed to fetch RevenueCat offerings');
      return null;
    }
  },

  /**
   * Purchase a subscription package.
   */
  purchasePackage: async (pack: PurchasesPackage): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') return false;

      const isConfigured = await Purchases.isConfigured();
      if (!isConfigured) return false;

      const { customerInfo } = await Purchases.purchasePackage(pack);
      const hasActiveEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      if (premiumListener) {
        premiumListener(hasActiveEntitlement);
      }
      return hasActiveEntitlement;
    } catch (err: any) {
      // Check if user cancelled the purchase to avoid error logs cluttering
      if (err.userCancelled) {
        logger.info('User cancelled subscription checkout flow');
      } else {
        logger.error(err, 'Error occurred during RevenueCat checkout flow');
      }
      throw err;
    }
  },

  /**
   * Restore user's previous App Store / Google Play purchases.
   */
  restorePurchases: async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') return false;

      const isConfigured = await Purchases.isConfigured();
      if (!isConfigured) return false;

      const customerInfo = await Purchases.restorePurchases();
      const hasActiveEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      if (premiumListener) {
        premiumListener(hasActiveEntitlement);
      }
      return hasActiveEntitlement;
    } catch (err) {
      logger.error(err, 'Error occurred while restoring purchases in RevenueCat');
      return false;
    }
  },
};
export type { PurchasesPackage, PurchasesOffering };
