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

// Better handling for safe area heights
const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 20;

const COLORS = {
  primary: "#25375A",
  white: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.15)",
  border: "rgba(255, 255, 255, 0.3)",
};

export default function Topbar({ showBack = false }) {
  const router = useRouter();
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(language === "en" ? "kh" : "en");
  };

  const flagSource = language === "en" ? Flag_en : Flag_kh;

  return (
    <View style={styles.topContainer}>
      <View style={styles.header}>
        {/* Left Section */}
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              // style={styles.circleBtn}
              activeOpacity={0.7}
            >
              <View style={styles.brandGroup}>
                <View style={styles.logoCircle}>
                  <Image
                    source={require("../../assets/images/Go_Global_IT_logo.png")}
                    style={styles.logo}
                  />
                </View>
                <View>
                  <Text style={styles.brandText}>GO eLEARNING</Text>
                  <View style={styles.onlineIndicator}>
                    <Text style={styles.statusText}>
                      Innovation • Education • Global
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.brandGroup}>
              <View style={styles.logoCircle}>
                <Image
                  source={require("../../assets/images/Go_Global_IT_logo.png")}
                  style={styles.logo}
                />
              </View>
              <View>
                <Text style={styles.brandText}>GO eLEARNING</Text>
                <View style={styles.onlineIndicator}>
                  <Text style={styles.statusText}>
                    Innovation • Education • Global
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Right Section */}
        <View style={styles.right}>
          <TouchableOpacity
            style={styles.glassChip}
            onPress={toggleLanguage}
            activeOpacity={0.8}
          >
            <Image source={flagSource} style={styles.flag} />
            <Text style={styles.langCode}>{language.toUpperCase()}</Text>
          </TouchableOpacity>

          <View style={styles.notificationWrapper}>
            <Notification />
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
    paddingBottom: 30,
    // paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  brandText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  onlineIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: -2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
  },
  statusText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  glassChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  flag: {
    width: 20,
    height: 14,
    borderRadius: 2,
    resizeMode: "cover",
  },
  langCode: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  notificationWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
});
