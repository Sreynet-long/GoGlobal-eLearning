import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Surface, Text, Title } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  slate: "#64748B",
  bgSoft: "#F8FAFC",
  border: "#E2E8F0",
};

export default function AboutScreen() {
  const router = useRouter();
  const { language } = useLanguage();

  const contactItems = [
    {
      key: "phone",
      label: t("call_us", language),
      value: "012 660 981",
      icon: "phone",
      onPress: async () => {
        const url = "tel:012660981";
        try {
          const supported = await Linking.canOpenURL(url);
          if (supported) await Linking.openURL(url);
          else Alert.alert(t("error", language), t("cannot_open_url", language));
        } catch (err) {
          Alert.alert(t("error", language), err.message);
        }
      },
      color: "#3B82F6",
    },
    {
      key: "email",
      label: t("email", language),
      value: "Send Mail",
      icon: "alternate-email",
      onPress: async () => {
        const url = "mailto:goglobalit2022@gmail.com";
        try {
          const supported = await Linking.canOpenURL(url);
          if (supported) await Linking.openURL(url);
          else Alert.alert(t("error", language), t("cannot_open_url", language));
        } catch (err) {
          Alert.alert(t("error", language), err.message);
        }
      },
      color: "#EF4444",
    },
    {
      key: "website",
      label: t("website", language),
      value: "Portfolio",
      icon: "public",
      onPress: async () => {
        const url = "https://www.go-globalit.com/";
        try {
          const supported = await Linking.canOpenURL(url);
          if (supported) await Linking.openURL(url);
          else Alert.alert(t("error", language), t("cannot_open_url", language));
        } catch (err) {
          Alert.alert(t("error", language), err.message);
        }
      },
      color: "#10B981",
    },
    {
      key: "facebook",
      label: t("facebook", language),
      value: "Follow Us",
      icon: "facebook",
      onPress: async () => {
        const url = "https://www.facebook.com/profile.php?id=100090694682396";
        try {
          const supported = await Linking.canOpenURL(url);
          if (supported) await Linking.openURL(url);
          else Alert.alert(t("error", language), t("cannot_open_url", language));
        } catch (err) {
          Alert.alert(t("error", language), err.message);
        }
      },
      color: "#0668E1",
    },
  ];

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.push("/(tabs)/account&Aboutus");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
        <MaterialIcons
          name="arrow-back-ios-new"
          size={20}
          color={COLORS.white}
        />
      </TouchableOpacity>

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { flexGrow: 1, minHeight: "100%" },
        ]}
      >
        <View style={styles.brandHeader}>
          <View style={styles.logoWrapper}>
            <MaterialIcons
              name="auto-stories"
              size={40}
              color={COLORS.accent}
            />
          </View>
          <Title style={styles.mainTitle}>
            <Text>{t("our_story", language)}</Text>
          </Title>
          <Text style={styles.brandDescription}>
            {t("our_story_text1", language)}
          </Text>
        </View>

        <View style={styles.accentRimLayer}>
          <Surface style={styles.contentBody} elevation={0}>
            <View style={styles.hoverContainer}>
              <Surface style={styles.visionCard} elevation={8}>
                <View style={styles.iconCircle}>
                  <MaterialIcons
                    name="visibility"
                    size={28}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.cardTitle}>
                  {t("our_vision", language)}
                </Text>
                <Text style={styles.cardText} numberOfLines={4}>
                  {t("our_vision_text", language)}
                </Text>
              </Surface>

              <Surface style={styles.missionCard} elevation={10}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: "rgba(212,175,55,0.2)" },
                  ]}
                >
                  <MaterialIcons
                    name="rocket-launch"
                    size={28}
                    color={COLORS.accent}
                  />
                </View>
                <Text style={[styles.cardTitle, { color: COLORS.white }]}>
                  {t("our_mission", language)}
                </Text>
                <Text
                  style={[styles.cardText, { color: "#94A3B8" }]}
                  numberOfLines={4}
                >
                  {t("our_mission_text", language)}
                </Text>
              </Surface>
            </View>

            <View style={styles.contactContainer}>
              <Text style={styles.sectionHeading}>
                {t("contact_us", language)}
              </Text>
              <View style={styles.contactGrid}>
                {contactItems.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.actionTile}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.tileIconWrapper,
                        { backgroundColor: item.color + "15" },
                      ]}
                    >
                      <MaterialIcons
                        name={item.icon}
                        size={24}
                        color={item.color}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tileLabel}>{item.label}</Text>
                      <Text style={styles.tileValue} numberOfLines={1}>
                        {item.value}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ height: 50 }} />
          </Surface>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 25 : 10,
    left: 20,
    zIndex: 100,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  brandHeader: {
    paddingTop: Platform.OS === "ios" ? 40 : 60,
    paddingBottom: 100,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 5,
    borderColor: COLORS.accent,
  },
  mainTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  brandDescription: {
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },
  accentRimLayer: {
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
  },
  contentBody: {
    flex: 1,
    backgroundColor: COLORS.bgSoft,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: 6,
    paddingHorizontal: 20,
  },
  hoverContainer: {
    flexDirection: "row",
    gap: 15,
    marginTop: -70,
    marginBottom: 30,
  },
  visionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: { elevation: 12 },
    }),
  },
  missionCard: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    padding: 20,
    borderWidth: 3,
    borderColor: COLORS.accent,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
      },
      android: { elevation: 15 },
    }),
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 20,
    backgroundColor: COLORS.bgSoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
  },
  cardText: {
    fontSize: 12,
    color: COLORS.slate,
    marginTop: 6,
    lineHeight: 18,
    textAlign: "center",
  },
  contactContainer: {
    marginTop: 10,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.slate,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 20,
    marginLeft: 5,
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionTile: {
    width: "48%",
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tileIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  tileLabel: {
    fontSize: 10,
    color: COLORS.slate,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  tileValue: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
});
