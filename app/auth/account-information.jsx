import { useQuery } from "@apollo/client";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Surface, Text } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_USER_BY_ID } from "../../schema/login";

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
  const { language } = useLanguage();
  const { data: userData } = useQuery(GET_USER_BY_ID, {
    fetchPolicy: "network-only",
  });

  const user = userData?.getUserById || {};

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

      <View style={styles.contentBody}>
        <View style={styles.titleRow}>
          <Text style={styles.contentTitle}>account information</Text>

          <TouchableOpacity>
            <MaterialIcons size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.infoGrid}>
            <InfoTile
              label={t("first_name", language)}
              value={user?.first_name}
              icon="account-box"
            />
            <InfoTile
              label={t("last_name", language)}
              value={user?.last_name}
              icon="badge"
            />
            <InfoTile
              label={t("phone", language)}
              value={user?.phone_number}
              icon="contact-phone"
            />
            <InfoTile
              label={t("gender", language)}
              value={user?.gender}
              icon="people"
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function InfoTile({ label, value, icon }) {
  return (
    <View style={styles.tile}>
      <View style={styles.tileIconBg}>
        <MaterialIcons name={icon} size={30} color={COLORS.primary} />
      </View>
      <View>
        <Text style={styles.tileLabel}>{label}</Text>
        <Text style={styles.tileValue}>{value || "-"}</Text>
      </View>
    </View>
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
  infoGrid: { marginBottom: 20 },
  tile: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.grey200,
    marginBottom: 12,
  },
  tileIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.grey600,
    textTransform: "uppercase",
  },
  tileValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 2,
  },
  contentBody: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderTopWidth: 5,
    borderColor: COLORS.accent,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.grey600,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 20,
  },
});
