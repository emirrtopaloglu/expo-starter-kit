import { Share, Platform } from 'react-native';

interface ShareOptions {
  message: string;
  title?: string;
  url?: string;
}

/**
 * Share utility.
 * Wraps React Native's native Share API for easy content sharing.
 */
export const share = {
  /**
   * Share raw text content.
   * @param message Text to share.
   * @param title Title of the shared content (Android specific).
   */
  shareText: async (message: string, title?: string): Promise<boolean> => {
    try {
      const result = await Share.share({
        message,
        title,
      });

      if (result.action === Share.sharedAction) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Share: Error sharing text:', error);
      return false;
    }
  },

  /**
   * Share a URL/Link.
   * @param url Website URL to share.
   * @param message Associated text/description.
   * @param title Title of the shared content.
   */
  shareUrl: async (url: string, message: string = '', title?: string): Promise<boolean> => {
    try {
      const shareContent: ShareOptions = {
        message: Platform.OS === 'android' ? `${message} ${url}`.trim() : message,
        title,
      };

      // On iOS, we can pass URL in options or content depending on system support
      if (Platform.OS === 'ios') {
        shareContent.url = url;
        // iOS requires message to be set even if just empty space if sharing url
        if (!shareContent.message) {
          shareContent.message = ' ';
        }
      }

      const result = await Share.share(shareContent);

      if (result.action === Share.sharedAction) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Share: Error sharing URL:', error);
      return false;
    }
  },
};
