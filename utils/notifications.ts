import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { PermissionManager } from './PermissionManager';
import { logger } from './logger';

// Set default notification handler behavior (foreground presentation)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notifications = {
  /**
   * Registers the device for push notifications and returns the Expo Push Token.
   * Handles permission requesting and platform-specific channel configuration.
   */
  registerForPushNotificationsAsync: async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return null;
    }

    try {
      // 1. Check & Request Permissions using the PermissionManager
      const checkRes = await PermissionManager.check('notifications');
      let status = checkRes.status;

      if (status !== 'granted') {
        const reqRes = await PermissionManager.request('notifications');
        status = reqRes.status;
      }

      if (status !== 'granted') {
        logger.warn('Push notification permission not granted');
        return null;
      }

      // 2. Fetch the Expo Push Token
      // Expo requires the EAS Project ID in SDK 54
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId || undefined,
      });

      const token = tokenData.data;
      logger.info('Successfully retrieved Expo Push Token:', token);

      // 3. Android specific channel configuration
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (error) {
      logger.error(error, 'Error registering for push notifications');
      return null;
    }
  },

  /**
   * Listen to notifications received while the app is in the foreground.
   */
  addNotificationReceivedListener: (
    callback: (notification: Notifications.Notification) => void
  ) => {
    return Notifications.addNotificationReceivedListener(callback);
  },

  /**
   * Listen to notification response actions (when user taps on a notification).
   */
  addNotificationResponseReceivedListener: (
    callback: (response: Notifications.NotificationResponse) => void
  ) => {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },

  /**
   * Unsubscribe a notification listener.
   */
  removeNotificationSubscription: (subscription: Notifications.Subscription) => {
    subscription.remove();
  },
};
