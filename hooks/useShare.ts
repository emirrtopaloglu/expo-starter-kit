import { useCallback } from 'react';
import { share as shareUtil } from '@/utils/share';

/**
 * A hook wrapping the native Share API to easily trigger text and URL sharing dialogs.
 *
 * @returns shareText and shareUrl functions.
 */
export function useShare() {
  const shareText = useCallback(async (message: string, title?: string): Promise<boolean> => {
    return shareUtil.shareText(message, title);
  }, []);

  const shareUrl = useCallback(
    async (url: string, message?: string, title?: string): Promise<boolean> => {
      return shareUtil.shareUrl(url, message, title);
    },
    []
  );

  return { shareText, shareUrl };
}
