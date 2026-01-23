import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  background: "#F1F5F9",
  white: "#FFFFFF",
  error: "#F43F5E",
  textDark: "#0F172A",
  grey600: "#475569",
  grey200: "#E2E8F0",
};

export default function AccountScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router?.canGoBack()) router.back();
    else router.replace("/(tabs)/account&Aboutus");
  };

  return (
    <View behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar barStyle="light-content" />

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <View>
        <Text>Sreynet</Text>
        <Text>net@gmail.com</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
