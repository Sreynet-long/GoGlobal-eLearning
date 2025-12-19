import { Alert, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EnrolledButton() {
  const { language } = useLanguage();
  const { isAuth } = useAuth();

  const handleEnroll = async () => {
    if (!isAuth) {
      Alert.alert(t("please_login_first", language));
      return;
    }
    try {
      const enrollCourse =
        JSON.parse(await AsyncStorage.getItem("enrollCourse")) || [];
      if (!enrollCourse.includes(course._id)) {
        enrollCourse.push(course._id);
        await AsyncStorage.setItem(
          "enrollCourse",
          JSON.stringify(enrollCourse)
        );
        Alert.alert(t("enroll_successful", language));
        if (onSuccess) onSuccess();
      } else {
        Alert.alert(t("already_enrolled", language));
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      Alert.alert(t("enroll_failed", language));
    }
  };

  return (
    <TouchableOpacity  style={{
        backgroundColor: "#213292ff",
        marginTop: 15,
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
      }} onPress={handleEnroll}>
      <Text
        style={{
          alignItems: "center",
          color: "#fff",    
          fontSize: 16,
        }}
      >
        {t("confirm_enroll", language) || "Confirm Enroll"}
      </Text>
    </TouchableOpacity>
  );
}
