import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";

/**
 * DetailsScreen component.
 * This screen demonstrates navigation to a secondary route.
 *
 * Documentation: https://docs.expo.dev/router/create-pages/
 */
export default function DetailsScreen() {
  return (
    <View style={styles.container}>
      {/* 
        Stack.Screen allows us to configure the header options dynamically 
        from within the screen component itself.
      */}
      <Stack.Screen options={{ title: "Details" }} />

      <Text style={styles.text}>This is the Details Screen!</Text>
      <Text style={styles.subText}>You successfully navigated here.</Text>
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
});
