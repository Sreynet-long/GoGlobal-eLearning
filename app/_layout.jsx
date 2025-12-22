import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";
import client from "../lib/apolloClient";

export default function RootLayout() {
  // const router = useRouter();
  // const segments = useSegments();
  // const hasHandled = useRef(false);

  // useEffect(() => {
  //   const isVerifyOtp =
  //     segments.includes("verify-otp") &&
  //     !segments.includes("auth/update-password");

  //   if (!hasHandled.current && isVerifyOtp) {
  //     hasHandled.current = true;

  //     router.replace("/(tabs)");
  //   }
  // }, [segments]);

  return (
    <LanguageProvider>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="(tabs)"
              options={{ initialRouteName: "index" }}
            />
            <Stack.Screen name="(auth)" />
          </Stack>
        </AuthProvider>
      </ApolloProvider>
    </LanguageProvider>
  );
}
