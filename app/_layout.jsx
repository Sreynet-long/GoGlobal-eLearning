// app/_layout.jsx
import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router"; // this is correct for Expo Router v6+
import { AuthProvider } from "../context/AuthContext";
import client from "../lib/apolloClient";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false, // hide headers for all screens by default
          }}
        >
          {/* Add screens if needed */}
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthProvider>
    </ApolloProvider>
  );
}
