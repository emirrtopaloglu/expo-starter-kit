import * as Haptics from 'expo-haptics';

/**
 * Haptic feedback utility.
 * Provides easy access to Haptics methods.
 */
export const haptics = {
  /**
   * Impact feedback styles.
   */
  Impact: Haptics.ImpactFeedbackStyle,

  /**
   * Notification feedback types.
   */
  Notification: Haptics.NotificationFeedbackType,

  /**
   * Trigger a selection feedback.
   * Use this for small interactions like button presses or list item selections.
   */
  selection: async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.warn('Haptics not available', error);
    }
  },

  /**
   * Trigger an impact feedback.
   * @param style The style of impact (Light, Medium, Heavy). Defaults to Medium.
   */
  impact: async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    try {
      await Haptics.impactAsync(style);
    } catch (error) {
      console.warn('Haptics not available', error);
    }
  },

  /**
   * Trigger a notification feedback.
   * @param type The type of notification (Success, Warning, Error).
   */
  notification: async (type: Haptics.NotificationFeedbackType) => {
    try {
      await Haptics.notificationAsync(type);
    } catch (error) {
      console.warn('Haptics not available', error);
    }
  },
};
