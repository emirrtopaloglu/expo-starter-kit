import { Platform, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Audio from 'expo-av';

/**
 * ==========================================================================================
 * PERMISSION MANAGER
 * ==========================================================================================
 *
 * A centralized manager for handling app permissions.
 *
 * 1. INSTALLATION:
 *    Ensure the following packages are installed:
 *    npx expo install expo-camera expo-media-library expo-location expo-notifications expo-image-picker expo-av
 *
 * 2. APP.JSON CONFIGURATION (Required for Production):
 *    Add the following keys to your `app.json` inside `expo.plugins` or `ios/android` config.
 *
 *    {
 *      "expo": {
 *        "plugins": [
 *          [
 *            "expo-camera",
 *            {
 *              "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera to take photos.",
 *              "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone to record videos."
 *            }
 *          ],
 *          [
 *            "expo-media-library",
 *            {
 *              "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
 *              "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos."
 *            }
 *          ],
 *          [
 *            "expo-location",
 *            {
 *              "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
 *            }
 *          ],
 *          [
 *             "expo-image-picker",
 *             {
 *                "photosPermission": "The app accesses your photos to let you share them with your friends."
 *             }
 *          ],
 *          [
 *             "expo-av",
 *             {
 *                "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone."
 *             }
 *          ]
 *        ]
 *      }
 *    }
 *
 * ==========================================================================================
 */

export type PermissionType =
  | 'camera'
  | 'gallery'
  | 'locationForeground'
  | 'notifications'
  | 'audio'
  | 'microphone';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'blocked';

export interface PermissionResponse {
  status: PermissionStatus;
  canAskAgain: boolean;
  granted: boolean;
  expires?: string;
}

class PermissionManagerImpl {
  /**
   * Check the current status of a permission without requesting it.
   */
  async check(type: PermissionType): Promise<PermissionResponse> {
    switch (type) {
      case 'camera':
        return this.normalize(await Camera.getCameraPermissionsAsync());
      case 'gallery':
        return this.normalize(await MediaLibrary.getPermissionsAsync());
      case 'locationForeground':
        return this.normalize(await Location.getForegroundPermissionsAsync());
      case 'notifications':
        return this.normalize(await Notifications.getPermissionsAsync());
      case 'audio':
      case 'microphone':
        return this.normalize(await Audio.Audio.getPermissionsAsync());
      default:
        throw new Error(`Unsupported permission type: ${type}`);
    }
  }

  /**
   * Request a permission.
   */
  async request(type: PermissionType): Promise<PermissionResponse> {
    switch (type) {
      case 'camera':
        return this.normalize(await Camera.requestCameraPermissionsAsync());
      case 'gallery':
        // MediaLibrary handles strict "files" access. ImagePicker is often sufficient for just picking.
        // We use MediaLibrary here for full gallery access.
        return this.normalize(await MediaLibrary.requestPermissionsAsync());
      case 'locationForeground':
        return this.normalize(await Location.requestForegroundPermissionsAsync());
      case 'notifications':
        return this.normalize(await Notifications.requestPermissionsAsync());
      case 'audio':
      case 'microphone':
        return this.normalize(await Audio.Audio.requestPermissionsAsync());
      default:
        throw new Error(`Unsupported permission type: ${type}`);
    }
  }

  /**
   * Helper to open system settings if a permission is blocked.
   */
  async openSettings(): Promise<void> {
    await Linking.openSettings();
  }

  /**
   * Normalize Expo's various permission response objects into a single consistent shape.
   */
  private normalize(response: any): PermissionResponse {
    return {
      status: response.status,
      // Some APIs don't return canAskAgain, default to true if missing unless status is denied/granted
      canAskAgain: response.canAskAgain ?? true,
      granted: response.granted,
      expires: response.expires,
    };
  }
}

export const PermissionManager = new PermissionManagerImpl();
