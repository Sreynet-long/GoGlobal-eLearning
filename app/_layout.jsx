import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import client from "../lib/apolloClient";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </AuthProvider>
    </ApolloProvider>
  );
}
