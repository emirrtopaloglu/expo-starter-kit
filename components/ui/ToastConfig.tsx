import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseToastProps } from "react-native-toast-message";
import { CheckCircle, XCircle, Info } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";

/**
 * Custom Toast component that mimics the look of 'react-hot-toast'.
 * Supports Dark Mode.
 */
const CustomToast = ({
  text1,
  text2,
  type,
}: {
  text1?: string;
  text2?: string;
  type: "success" | "error" | "info";
}) => {
  const { activeTheme } = useTheme();
  const styles = getStyles(activeTheme);

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <CheckCircle
            size={24}
            color="#4ADE80"
            fill={activeTheme === "dark" ? "#064e3b" : "#ecfdf5"}
          />
        ); // Green 400
      case "error":
        return (
          <XCircle
            size={24}
            color="#F87171"
            fill={activeTheme === "dark" ? "#7f1d1d" : "#fef2f2"}
          />
        ); // Red 400
      case "info":
        return (
          <Info
            size={24}
            color="#60A5FA"
            fill={activeTheme === "dark" ? "#1e3a8a" : "#eff6ff"}
          />
        ); // Blue 400
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.textContainer}>
        {text1 ? <Text style={styles.title}>{text1}</Text> : null}
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  );
};

export const toastConfig = {
  success: (props: BaseToastProps) => <CustomToast {...props} type="success" />,
  error: (props: BaseToastProps) => <CustomToast {...props} type="error" />,
  info: (props: BaseToastProps) => <CustomToast {...props} type="info" />,
};

const getStyles = (theme: "light" | "dark" | "system") => {
  const isDark = theme === "dark"; // Simplified for now, system handling can be added if needed context provides resolved string

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      width: "90%",
      backgroundColor: isDark ? "#333" : "#fff",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 50, // Pill shape
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
      marginTop: 10,
    },
    iconContainer: {
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 15,
      fontWeight: "600",
      color: isDark ? "#fff" : "#000",
    },
    message: {
      fontSize: 13,
      color: isDark ? "#aaa" : "#555",
      marginTop: 2,
    },
  });
};
