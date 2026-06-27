import { ActionSheetIOS, Alert, Platform } from 'react-native';

interface ActionSheetOptions {
  options: string[];
  cancelButtonIndex?: number;
  destructiveButtonIndex?: number;
  title?: string;
  message?: string;
}

/**
 * Cross-platform utility for native Action Sheets / Choice Dialogs.
 * Uses ActionSheetIOS on iOS for native bottom sheets and Alert.alert on Android for native dialog prompts.
 * Excellent for simple choices (e.g. Camera / Gallery / Cancel) with zero external dependencies and native performance.
 */
export const actionSheet = {
  show: (
    { options, cancelButtonIndex, destructiveButtonIndex, title, message }: ActionSheetOptions,
    callback: (index: number) => void
  ) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
          title,
          message,
        },
        callback
      );
    } else {
      // Android / Other platforms: Translate options into native Alert buttons.
      // Alert allows up to 3 buttons natively (positive, negative, neutral).
      // This is perfect for standard choices like Camera / Gallery / Cancel.
      const buttons = options.map((option, index) => {
        const isCancel = index === cancelButtonIndex;
        const isDestructive = index === destructiveButtonIndex;

        return {
          text: option,
          onPress: () => callback(index),
          style: isCancel
            ? ('cancel' as const)
            : isDestructive
              ? ('destructive' as const)
              : ('default' as const),
        };
      });

      // Sort buttons to position cancel/negative button appropriately
      Alert.alert(title || '', message || '', buttons, {
        cancelable: cancelButtonIndex !== undefined,
        onDismiss: () => {
          if (cancelButtonIndex !== undefined) {
            callback(cancelButtonIndex);
          }
        },
      });
    }
  },
};
