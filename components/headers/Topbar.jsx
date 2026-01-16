import { useRouter } from "expo-router";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Flag_en from "../../assets/flags/en.png";
import Flag_kh from "../../assets/flags/kh.png";
import { useLanguage } from "../../context/LanguageContext";
import Notification from "./Notification";

const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 0) + 1;

const COLORS = {
  primary: "#25375A",
  white: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.12)",
  border: "rgba(255, 255, 255, 0.2)",
};

export default function Topbar({ showBack = false }) {
  const router = useRouter();
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(language === "en" ? "kh" : "en");
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.topContainer}>
      <View style={styles.header}>
        
        <View style={styles.leftSide}>
          {/* {showBack && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )} */}

          <View style={styles.brandGroup}>
            <View style={styles.logoBox}>
              <Image
                source={require("../../assets/images/Go_Global_elearning_logo.png")}
                style={styles.logo}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.brandTitle}>GO <Text style={styles.lightText}>eLEARNING</Text></Text>
              <View style={styles.statusRow}>
                <Text style={styles.statusText}>
Innovation • Education • Global</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rightSide}>
          <View style={styles.utilityBar}>
            <TouchableOpacity 
              style={styles.langToggle} 
              onPress={toggleLanguage}
              activeOpacity={0.7}
            >
              <Image source={language === "en" ? Flag_en : Flag_kh} style={styles.flag} />
              <Text style={styles.langText}>{language.toUpperCase()}</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <View style={styles.notifIcon}>
              <Notification />
            </View>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: COLORS.primary,
    paddingTop: STATUS_BAR_HEIGHT,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.glass,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBox: {
    width: 54,
    height: 54,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  logo: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
  textContainer: {
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.2,
  },
  lightText: {
    fontWeight: "700",
    color: "#D4AF37",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#4ade80", 
  },
  statusText: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  utilityBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 4,
    height: 40,
  },
  langToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 6,
  },
  flag: {
    width: 20,
    height: 15,
    borderRadius: 2,
  },
  langText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
  divider: {
    width: 2,
    height: 25,
    backgroundColor: COLORS.border,
  },
  notifIcon: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});