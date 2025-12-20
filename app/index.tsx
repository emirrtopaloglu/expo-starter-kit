import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

/**
 * HomeScreen component.
 * This is the default route (app/index.tsx) which serves as the entry screen.
 *
 * Documentation: https://docs.expo.dev/router/create-pages/
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Main welcome text */}
      <Text style={styles.text}>Welcome to Expo Router!</Text>

      {/* Instruction text */}
      <Text style={styles.subText}>
        Start editing app/index.tsx to change this screen.
      </Text>

      {/* 
        The Link component allows for client-side navigation between routes.
        href targets the file path in the app directory.
      */}
      <Link href="/details" style={styles.link}>
        Go to Details Screen
      </Link>

      <Link href="/list" style={styles.link}>
        Go to Todo List (Zustand + FlashList)
      </Link>

      <Link href="/form" style={styles.link}>
        Go to Form Demo (React Hook Form + Zod)
      </Link>

      {/* 
        StatusBar controls the appearance of the status bar text and icons.
        style="auto" adjusts automatically based on the system theme.
      */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#666",
  },
  link: {
    marginTop: 20,
    fontSize: 18,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
