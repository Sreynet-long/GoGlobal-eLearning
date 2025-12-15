import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import client from "../lib/apolloClient";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </ApolloProvider>
  );
}
