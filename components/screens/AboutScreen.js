import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
import { Text, Title } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const COMPANY_LOGO = require("../../assets/images/Go_Global_elearning_logo.png");

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  slate: "#64748b",
  bgLight: "#F8FAFC",
};

export default function AboutScreen() {
  const { language } = useLanguage();

  const contactItems = [
    { key: "phone", label: t("call_us", language), value: "012 660 981", icon: "phone", onPress: () => Linking.openURL("tel:012660981"), color: "#3b82f6" },
    { key: "email", label: t("email", language), value: "Email Us", icon: "alternate-email", onPress: () => Linking.openURL("mailto:goglobalit2022@gmail.com"), color: "#ef4444" },
    { key: "website", label: t("website", language), value: "Website", icon: "public", onPress: () => Linking.openURL("https://www.go-globalit.com/"), color: "#10b981" },
    { key: "facebook", label: t("facebook", language), value: "Facebook", icon: "facebook", onPress: () => Linking.openURL("https://www.facebook.com/profile.php?id=100090694682396"), color: "#0668E1" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      

      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <Image source={COMPANY_LOGO} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.heroTitle}>GO <Text style={{fontWeight: '600', color:"#D4AF37"}}>eLEARNING</Text></Text>
        <Text style={styles.heroSubtitle}>Innovation • Education • Global</Text>
      </View>

      <View style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
 
          <View style={styles.centeredSection}>
            <View style={styles.iconCircleLarge}>
              <MaterialIcons name="auto-stories" size={32} color={COLORS.accent} />
            </View>
            <Text style={styles.centeredTitle}>{t("our_story", language)}</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.centeredParagraph}>{t("our_story_text1", language)}</Text>
            <Text style={styles.centeredParagraph}>{t("our_story_text2", language)}</Text>
          </View>

          <View style={styles.missionVisionContainer}>
            <View style={[styles.fullBento, { backgroundColor: '#EBF2FF' }]}>
               <MaterialIcons name="visibility" size={30} color={COLORS.primary} />
               <Text style={styles.bentoTitle}>{t("our_vision", language)}</Text>
               <Text style={styles.bentoText}>{t("our_vision_text", language)}</Text>
            </View>

            <View style={[styles.fullBento, { backgroundColor: '#FFF9E6' }]}>
               <MaterialIcons name="rocket-launch" size={30} color={COLORS.accent} />
               <Text style={styles.bentoTitle}>{t("our_mission", language)}</Text>
               <Text style={styles.bentoText}>{t("our_mission_text", language)}</Text>
            </View>
          </View>

          <Text style={[styles.centeredTitle, { marginTop: 20 }]}>{t("contact_us", language)}</Text>
          <View style={styles.contactGrid}>
            {contactItems.map((item) => (
              <TouchableOpacity key={item.key} style={styles.contactCard} onPress={item.onPress}>
                <View style={[styles.iconCircleSmall, { backgroundColor: item.color + '15' }]}>
                  <MaterialIcons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.contactLabel}>{item.label}</Text>
                <Text style={styles.contactValue}>{item.value}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </View>
    </View>
  );
}

//==================== Styles ====================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  
  heroSection: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: { width: 60, height: 60 },
  heroTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 5,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 5,
  },

  body: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -40,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop:40
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 0,
    paddingBottom: 115,
    alignItems: 'center', 
    marginBottom:60
  },

  centeredSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircleLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff9e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  centeredTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginTop: 4,
    marginBottom: 20,
  },
  centeredParagraph: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.slate,
    textAlign: 'center',
    marginBottom: 15,
  },

  missionVisionContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 10,
  },
  fullBento: {
    width: '100%',
    padding: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  bentoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 10,
  },
  bentoText: {
    fontSize: 14,
    color: COLORS.slate,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },

  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  contactCard: {
    width: '47%',
    backgroundColor: COLORS.bgLight,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  iconCircleSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
});