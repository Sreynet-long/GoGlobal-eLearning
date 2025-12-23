import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

export default function EnrolledButton({ course, onSuccess }) {
  const { language } = useLanguage();
  const { isAuth } = useAuth();
  const router = useRouter();

  const handleEnroll = async () => {
    try {
      const stored = await AsyncStorage.getItem("enrolledCourses");
      const enrolled = stored ? JSON.parse(stored) : [];

      const exists = enrolled.find((c) => c._id === course._id);
      if (exists) {
        Alert.alert("Information", "You already enrolled this course");
        return;
      }

      const enrolledCourse = {
        ...course,
        progress: 0,
      };

      const updated = [...enrolled, enrolledCourse];

      await AsyncStorage.setItem("enrolledCourses", JSON.stringify(updated));

      Alert.alert("Success", "Course enrolled successfully");
      onSuccess?.();
    } catch (err) {
      console.log("Enroll error:", err);
      Alert.alert("Error", "Failed to enroll course");
    }
  };

  const handleLoginRequired = () => {
    Alert.alert("Login required", "Please login first", 
      [
        {
          text: "OK",
          style: "ok"
        },
        // {
        //   text: "Ok",
        //   onPress: () => router.push("/(auth)/login"),
        // }
      ]);
  };

  return (
    <TouchableOpacity
      style={styles.cartButton}
      onPress={() => {
        if (!isAuth) {
          handleLoginRequired();
          return;
        }
        handleEnroll();
      }}
    >
      <Text style={styles.cartText}>{t("confirm_enroll", language)}</Text>
    </TouchableOpacity>
  );
}

const styles = {
  cartButton: {
    backgroundColor: "#58589bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cartText: {
    color: "#fff",
    fontWeight: "bold",
  },
};
