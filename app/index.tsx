import { View, Text, StyleSheet, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { haptics } from "@/utils/haptics";
import { toast } from "@/utils/toast";

/**
 * HomeScreen component.
 * This is the default route (app/index.tsx) which serves as the entry screen.
 *
 * Documentation: https://docs.expo.dev/router/create-pages/
 */
export default function HomeScreen() {
  const { activeTheme } = useTheme();
  const styles = getStyles(activeTheme);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      {/* Main welcome text */}
      <Text style={styles.text}>{t("welcome")}</Text>

      {/* Instruction text */}
      <Text style={styles.subText}>{t("description")}</Text>

      {/* 
        The Link component allows for client-side navigation between routes.
        href targets the file path in the app directory.
      */}
      <Link href="/details" style={styles.link}>
        {t("links.details")}
      </Link>

      <Link href="/list" style={styles.link}>
        {t("links.list")}
      </Link>

      <Link href="/form" style={styles.link}>
        {t("links.form")}
      </Link>

      <View style={styles.langContainer}>
        <Text style={[styles.subText, { marginBottom: 10 }]}>
          {t("language.current", { lang: i18n.language })}
        </Text>
        <View style={styles.buttonGroup}>
          <Button
            title="English"
            onPress={() => {
              haptics.selection();
              changeLanguage("en");
            }}
          />
          <Button
            title="Türkçe"
            onPress={() => {
              haptics.selection();
              changeLanguage("tr");
            }}
          />
        </View>
      </View>

      <View style={styles.testContainer}>
        <Text style={[styles.subText, { marginBottom: 10 }]}>
          UI Feedback Tests
        </Text>
        <View style={styles.buttonGroup}>
          <Button
            title="Success Toast"
            onPress={() => {
              haptics.notification(haptics.Notification.Success);
              toast.success("Success!", "Action completed successfully.");
            }}
          />
          <Button
            title="Error Toast"
            color="red"
            onPress={() => {
              haptics.notification(haptics.Notification.Error);
              toast.error("Error!", "Something went wrong.");
            }}
          />
        </View>
      </View>

      <ThemeToggle />

      {/*  
        StatusBar controls the appearance of the status bar text and icons.
        style="auto" adjusts automatically based on the system theme.
      */}
      <StatusBar style={activeTheme === "dark" ? "light" : "dark"} />
    </View>
  );
}

const getStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#121212" : "#fff",
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme === "dark" ? "#fff" : "#000",
    },
    subText: {
      fontSize: 16,
      color: theme === "dark" ? "#aaa" : "#666",
      textAlign: "center",
      paddingHorizontal: 20,
    },
    langContainer: {
      marginTop: 30,
      alignItems: "center",
      width: "100%",
    },
    testContainer: {
      marginTop: 20,
      alignItems: "center",
      width: "100%",
    },
    buttonGroup: {
      flexDirection: "row",
      gap: 20,
    },
    link: {
      marginTop: 20,
      fontSize: 18,
      color: "#007AFF",
      textDecorationLine: "underline",
    },
  });
