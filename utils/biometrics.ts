import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Biometrics utility.
 * Wraps expo-local-authentication to handle FaceID / TouchID checkpoints.
 */
export const biometrics = {
  /**
   * Check if biometric authentication is supported and enrolled on the device.
   */
  isSupported: async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) return false;

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return isEnrolled;
    } catch (error) {
      console.error('Biometrics: Error checking support:', error);
      return false;
    }
  },

  /**
   * Get supported biometric types (Fingerprint, Facial Recognition, etc.).
   */
  getSupportedTypes: async (): Promise<LocalAuthentication.AuthenticationType[]> => {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Biometrics: Error getting supported types:', error);
      return [];
    }
  },

  /**
   * Trigger local authentication screen (TouchID/FaceID).
   * @param promptMessage Optional customized message shown in iOS TouchID (ignored by FaceID/Android).
   * @returns boolean indicating success.
   */
  authenticate: async (
    promptMessage: string = 'Please authenticate to continue'
  ): Promise<boolean> => {
    try {
      const supported = await biometrics.isSupported();
      if (!supported) {
        console.warn('Biometrics: Hardware or enrollment not available on device.');
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometrics: Error during authentication:', error);
      return false;
    }
  },
};
