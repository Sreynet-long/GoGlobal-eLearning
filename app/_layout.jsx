import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import client from "../lib/apolloClient";

function AppStack() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AppStack />
      </AuthProvider>
    </ApolloProvider>
  );
}
