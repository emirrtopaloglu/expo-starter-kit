import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

/**
 * RootLayout component.
 * This is the main layout for the application.
 * It uses a Stack navigator to manage screen transitions.
 *
 * Documentation: https://docs.expo.dev/router/layouts/
 */
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        {/* 
          The "index" screen corresponds to app/index.tsx.
          We set the header title to "Home" for the initial screen.
        */}
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
    </QueryClientProvider>
  );
}
