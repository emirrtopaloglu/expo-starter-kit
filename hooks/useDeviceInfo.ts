import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export interface DeviceInfo {
  platform: string;
  osVersion: string | number;
  appVersion: string;
  buildNumber: string;
  deviceId: string | null;
  deviceName: string | null;
  isDevice: boolean;
}

/**
 * A hook that retrieves device information, platforms, operating system versions,
 * and app version details.
 *
 * @returns DeviceInfo object.
 */
export function useDeviceInfo(): DeviceInfo {
  return {
    platform: Platform.OS,
    osVersion: Device.osVersion || Platform.Version,
    appVersion: Constants.expoConfig?.version || '1.0.0',
    buildNumber: Platform.select({
      ios: Constants.expoConfig?.ios?.buildNumber || '1',
      android: String(Constants.expoConfig?.android?.versionCode || '1'),
      default: '1',
    }),
    deviceId: Device.osBuildId || null,
    deviceName: Device.deviceName || null,
    isDevice: Device.isDevice,
  };
}
