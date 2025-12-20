import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Text, Title, useTheme } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const COMPANY_LOGO = require("../../assets/images/Go_Global_IT_logo.png");

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  background: "#F7F9FC",
  white: "#FFFFFF",
  grey300: "#E0E0E0",
  grey600: "#757575",
  textDark: "#212121",
};

export default function AboutScreen() {
  const theme = useTheme();
  const { language } = useLanguage();
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (key) => setOpenItem(openItem === key ? null : key);

  const handleCall = () => Linking.openURL("tel:012660981");
  const handleEmail = () => Linking.openURL("mailto:goglobalit2022@gmail.com");

  const contactItems = [
    {
      key: "phone",
      label: t("call_us", language),
      value: "012 660 981",
      icon: "phone",
      onPress: handleCall,
    },
    {
      key: "email",
      label: t("email", language),
      value: "goglobalit2022@gmail.com",
      icon: "email",
      onPress: handleEmail,
    },
    {
      key: "website",
      label: t("website", language),
      value: "go-globalit.com",
      icon: "language",
      onPress: () => Linking.openURL("https://www.go-globalit.com/"),
    },
    {
      key: "facebook",
      label: t("facebook", language),
      value: "Facebook",
      icon: "facebook",
      onPress: () =>
        Linking.openURL(
          "https://www.facebook.com/profile.php?id=100090694682396"
        ),
    },
  ];

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topColorBlock}>
        <View style={styles.headerContent}>
          <View style={styles.logoWrapper}>
            <Image
              source={COMPANY_LOGO}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Title style={styles.mainTitle}>
            {t("about_go_elearning", language)}
          </Title>
          <Text style={styles.subTitle}>Innovation • Education • Global</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Card style={[styles.card, { marginTop: 20 }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <MaterialIcons
                  name="history-edu"
                  size={36}
                  color={COLORS.accent}
                />
                <Title style={styles.cardTitle}>
                  {t("our_story", language)}
                </Title>
              </View>
              <Text style={styles.paragraph}>
                {t("our_story_text1", language)}
              </Text>
              <Text style={styles.paragraph}>
                {t("our_story_text2", language)}
              </Text>
            </Card.Content>
          </Card>
          <View style={styles.row}>
            <View style={[styles.halfCard, { backgroundColor: "#E3F2FD" }]}>
              <MaterialIcons
                name="visibility"
                size={35}
                color={COLORS.primary}
              />
              <Text style={styles.smallTitle}>{t("our_vision", language)}</Text>
              <Text style={styles.smallText}>
                {t("our_vision_text", language)}
              </Text>
            </View>
            <View style={[styles.halfCard, { backgroundColor: "#FFFDE7" }]}>
              <MaterialIcons
                name="rocket-launch"
                size={35}
                color={COLORS.accent}
              />
              <Text style={styles.smallTitle}>
                {t("our_mission", language)}
              </Text>
              <Text style={styles.smallText}>
                {t("our_mission_text", language)}
              </Text>
            </View>
          </View>

          <Title style={styles.contactSectionTitle}>
            {t("contact_us", language)}
          </Title>
          <View style={styles.contactGrid}>
            {contactItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.contactItem}
                onPress={() => {
                  toggleItem(item.key);
                  item.onPress();
                }}
              >
                <View style={styles.iconCircle}>
                  <MaterialIcons
                    name={item.icon}
                    size={35}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.contactLabel}>{item.label}</Text>
                <Text style={styles.contactValueShort} numberOfLines={1}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.white },

  topColorBlock: {
    backgroundColor: COLORS.primary,
    height: 250,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    alignItems: "center",
  },
  headerContent: { alignItems: "center" },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.2)",
  },
  logoImage: { width: 60, height: 60 },
  mainTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.white,
    marginTop: 12,
  },
  subTitle: { color: "rgba(255,255,255,0.6)", fontSize: 15, letterSpacing: 1 },

  mainContent: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -50,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  card: {
    borderRadius: 20,
    backgroundColor: COLORS.white,
    elevation: 3,
    marginBottom: 15,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  cardTitle: { fontSize: 25, fontWeight: "700", color: COLORS.primary },
  paragraph: {
    lineHeight: 20,
    marginBottom: 12,
    fontSize: 19,
    color: COLORS.grey600,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  halfCard: {
    width: "48%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  smallTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginVertical: 8,
    color: COLORS.textDark,
  },
  smallText: {
    fontSize: 18,
    textAlign: "center",
    color: COLORS.grey600,
    fontStyle: "italic",
  },
  contactSectionTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 15,
    marginLeft: 5,
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  contactItem: {
    width: "48%",
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 22.5,
    backgroundColor: "rgba(37, 55, 90, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  contactLabel: { fontSize: 16, color: COLORS.grey600, fontWeight: "600" },
  contactValueShort: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: 2,
    fontWeight: "700",
  },
});
