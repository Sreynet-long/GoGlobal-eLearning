import { useState } from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Notification from "./Notification";
import Flag_en from "../../assets/flags/en.png";
import Flag_kh from "../../assets/flags/kh.png";

const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 20;

export default function Topbar() {
  const [currentLang, setCurrentLang] = useState("en");

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "kh" : "en";
    setCurrentLang(newLang);
    // console.log(`language change to: ${newLang}`);
  };

  const changeFlag = () => {
    return currentLang === "en" ? Flag_en : Flag_kh;
  }
  return (
    <View style={styles.topContainer}> 
      <View style={styles.header}>
        <View style={styles.left}>
          <Image
            source={require("../../assets/logos/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.text}>GO eLEARNING</Text>
        </View>
        <View style={styles.right}>
          <TouchableOpacity
            style={styles.flagPlaceholder}
            onPress={toggleLanguage}
          >
            <Image source={changeFlag()} style={{ width: 20, height: 15 }} />
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
    width: 35,
    height: 35,
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
  flagText: {
    fontSize: 16,
    color: "#fff",
  },
});
