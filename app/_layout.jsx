import { ApolloProvider } from "@apollo/client/react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";
import client from "../lib/apolloClient";

export default function RootLayout() {
  const [fontsLoad, error] = useFonts({
    Siemreap: require("../assets/fonts/Siemreap-Regular.ttf"),
  });
  return (
    <LanguageProvider>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" styles={{getBackgroundColorAsync:"white"}}/>
            <Stack.Screen name="(auth)" />
          </Stack>
        </AuthProvider>
      </ApolloProvider>
    </LanguageProvider>
  );
}
