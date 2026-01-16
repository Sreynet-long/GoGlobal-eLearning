import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";
import client from "../lib/apolloClient";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible while we fetch resources

export default function RootLayout() {
  useEffect(() => {
    async function hideSplash() {
      // Simulate a resource loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await SplashScreen.hideAsync();
    }
    hideSplash();
  }, []);

  return (
    <LanguageProvider>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="(tabs)"
              options={{ initialRouteName: "index" }}
            />
            <Stack.Screen name="auth" />
          </Stack>
        </AuthProvider>
      </ApolloProvider>
    </LanguageProvider>
  );
}
