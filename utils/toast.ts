import Toast from "react-native-toast-message";

/**
 * Toast notification utility.
 * Wrapper around react-native-toast-message for consistent usage.
 */
export const toast = {
  /**
   * Show a success toast.
   * @param title The title of the toast.
   * @param message The message body (optional).
   */
  success: (title: string, message?: string) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
    });
  },

  /**
   * Show an error toast.
   * @param title The title of the toast.
   * @param message The message body (optional).
   */
  error: (title: string, message?: string) => {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
    });
  },

  /**
   * Show an info toast.
   * @param title The title of the toast.
   * @param message The message body (optional).
   */
  info: (title: string, message?: string) => {
    Toast.show({
      type: "info",
      text1: title,
      text2: message,
    });
  },
};
