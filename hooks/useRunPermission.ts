import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { PermissionManager, PermissionType } from '@/utils/PermissionManager';

/**
 * A generic hook to execute a callback only if a permission is granted.
 * It handles the flow of checking -> requesting -> alerting if blocked.
 */
export const useRunPermission = () => {
  const executeWithPermission = useCallback(
    async (type: PermissionType, onGranted: () => void, onDenied?: () => void) => {
      try {
        // 1. Check current status
        const check = await PermissionManager.check(type);

        if (check.granted) {
          onGranted();
          return;
        }

        // 2. If not granted, request it
        if (check.canAskAgain || check.status === 'undetermined') {
          const request = await PermissionManager.request(type);
          if (request.granted) {
            onGranted();
          } else {
            onDenied?.();
          }
          return;
        }

        // 3. If blocked (canAskAgain = false & not granted), show alert to open settings
        if (!check.granted && !check.canAskAgain) {
          Alert.alert(
            'Permission Required',
            `Passkey requires access to ${type} to function. Please enable it in settings.`,
            [
              { text: 'Cancel', style: 'cancel', onPress: onDenied },
              {
                text: 'Open Settings',
                onPress: () => PermissionManager.openSettings(),
              },
            ]
          );
        }
      } catch (error) {
        console.error('Permission check failed:', error);
        onDenied?.();
      }
    },
    []
  );

  return { executeWithPermission };
};
