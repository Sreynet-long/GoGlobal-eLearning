import { Ionicons } from "@expo/vector-icons";
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
import { Title } from "react-native-paper";
import Flag_en from "../../assets/flags/en.png";
import Flag_kh from "../../assets/flags/kh.png";
import { useLanguage } from "../../context/LanguageContext";
import Notification from "./Notification";

const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 20;

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
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/"); // fallback route
                }
              }}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <>
              <Image
                source={require("../../assets/images/Go_Global_IT_logo.png")}
                style={styles.logo}
              />
              <Text style={styles.text}>GO eLEARNING</Text>
              <Title style={{ color: "#fff", marginLeft: 6 }}>
                {/* {t("home", language)} */}
              </Title>
            </>
          )}
        </View>

        <View style={styles.right}>
          <TouchableOpacity
            style={styles.flagPlaceholder}
            onPress={toggleLanguage}
          >
            <Image source={flagSource} style={styles.flag} />
          </TouchableOpacity>

          <Notification />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: "#25375aff",
    paddingTop: STATUS_BAR_HEIGHT,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 8,
    resizeMode: "contain",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flagPlaceholder: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  flag: {
    width: 20,
    height: 15,
    resizeMode: "contain",
  },
});
