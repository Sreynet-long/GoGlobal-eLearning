import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView
} from "react-native";
import { Text , Surface} from "react-native-paper";

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
    <KeyboardAvoidingView   
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.navBar}>
        
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerHero}>
        <View style={styles.avatarWrapper}>
          <Surface style={styles.avatarSurface}>
            <View style={[styles.avatar, { backgroundColor: "#ccc" }]} />
          </Surface>
        </View>
        <Text style={styles.heroName}>Sreynet</Text>
        <Text style={styles.userEmailText}>net@gmail.com</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.primary },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 25 : 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarWrapper: { marginBottom: 5 },
  avatarSurface: {
    width: 130,
    height: 130,
    borderRadius: 65,
    position: "relative",
    borderWidth: 5,
    borderColor: COLORS.accent,
  },
  headerHero: { paddingBottom: 30, alignItems: "center" },
  heroName: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  userEmailText: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 },
});
