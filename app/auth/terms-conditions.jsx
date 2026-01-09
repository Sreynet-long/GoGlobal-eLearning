import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import {
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

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  slate: "#475569",
  bgLight: "#F8FAFC",
  grey200: "#E2E8F0",
  grey600: "#64748B",
};

export default function TermsScreen() {
  const router = useRouter();
  const { language } = useLanguage();

  const sections = [
    {
      id: "01",
      title: t("acceptance_of_terms", language),
      content: t("acceptance_of_terms_content", language),
    },
    {
      id: "02",
      title: t("user_accounts", language),
      content: t("user_accounts_content", language),
    },
    {
      id: "03",
      title: t("intellectual_property", language),
      content: t("intellectual_property_content", language),
    },
    {
      id: "04",
      title: t("privacy_policy", language),
      content: t("privacy_policy_content", language),
    },
    {
      id: "05",
      title: t("limitation_of_liability", language),
      content: t("limitation_of_liability_content", language),
    },
    {
      id: "06",
      title: t("modifications", language),
      content: t("modifications_content", language),
    },
  ];

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/account&Aboutus");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={18}
            color={COLORS.white}
          />
        </TouchableOpacity>

        <View style={styles.headerCenteredContent}>
          <View style={styles.iconGlow}>
            <MaterialIcons name="gavel" size={40} color={COLORS.accent} />
          </View>
          <Text style={styles.headerTitle}>
            {t("terms_conditions", language)}
          </Text>
          <View style={styles.versionTag}>
            <Text style={styles.versionText}>
              {t("version_tag", language, {
                version: "1.0.2",
                date: "DEC 2024",
              })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.accentBackgroundLayer}>
        <Surface style={styles.body} elevation={0}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { flexGrow: 1, minHeight: "100%" },
            ]}
          >
            <View style={styles.introBox}>
              <Text style={styles.introText}>
                {t("terms_intro_text", language)}
              </Text>
            </View>

            {sections.map((item, index) => (
              <Surface key={index} style={styles.sectionCard} elevation={1}>
                <View style={styles.sectionHeader}>
                  <View style={styles.idCircle}>
                    <Text style={styles.idText}>{item.id}</Text>
                  </View>
                  <Text style={[styles.sectionTitle, { marginLeft: 12 }]}>
                    {item.title}
                  </Text>
                </View>
                <Text style={styles.sectionContent}>{item.content}</Text>
              </Surface>
            ))}

            <View style={styles.bottomSpacer} />
          </ScrollView>

          <View style={styles.floatingFooter}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.contactBtn}
              onPress={() => router.push("/auth/contact-us")}
            >
              <MaterialIcons
                name="support-agent"
                size={24}
                color={COLORS.white}
              />
              <Text style={[styles.contactBtnText, { marginLeft: 10 }]}>
                {t("contact_support", language)}
              </Text>
            </TouchableOpacity>
          </View>
        </Surface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  header: {
    paddingTop: Platform.OS === "ios" ? 30 : 25,
    paddingBottom: 25,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "ios" ? 25 : 15,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenteredContent: { alignItems: "center" },
  iconGlow: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 5,
    borderColor: COLORS.accent,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "center",
  },
  versionTag: {
    marginTop: 10,
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  versionText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.accent,
    letterSpacing: 1,
  },
  accentBackgroundLayer: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: 6,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 120 },
  introBox: { paddingHorizontal: 20, marginBottom: 25 },
  introText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.grey600,
    textAlign: "center",
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: { elevation: 2 },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  idCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  idText: { color: COLORS.accent, fontSize: 15, fontWeight: "800" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    flex: 1,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.slate,
    paddingLeft: 40,
  },
  bottomSpacer: { height: 20 },
  floatingFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "transparent",
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 18,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  contactBtnText: { fontSize: 15, fontWeight: "800", color: COLORS.white },
});
