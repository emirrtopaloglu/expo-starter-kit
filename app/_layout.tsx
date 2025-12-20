import { Stack } from "expo-router";

/**
 * RootLayout component.
 * This is the main layout for the application.
 * It uses a Stack navigator to manage screen transitions.
 *
 * Documentation: https://docs.expo.dev/router/layouts/
 */
export default function RootLayout() {
  return (
    <Stack>
      {/* 
        The "index" screen corresponds to app/index.tsx.
        We set the header title to "Home" for the initial screen.
      */}
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
