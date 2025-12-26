import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";
import client from "../lib/apolloClient";

export default function RootLayout() {

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
