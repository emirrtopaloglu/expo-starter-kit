import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Camera, Home, Settings } from "lucide-react-native";

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

      <View style={styles.iconContainer}>
        <Home color="black" size={32} />
        <Camera color="black" size={32} />
        <Settings color="black" size={32} />
      </View>
      <Text style={styles.iconText}>Icons by Lucide React Native</Text>
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
  iconContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 30,
  },
  iconText: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
  },
});
