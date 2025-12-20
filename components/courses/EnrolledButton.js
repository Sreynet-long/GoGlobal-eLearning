import { Alert, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export default function EnrolledButton({course, onSuccess}) {
  const { language } = useLanguage();
  const { isAuth } = useAuth();
  
  const handleEnroll = async (course) => {
  try {
    const stored = await AsyncStorage.getItem("enrolledCourses");
    const enrolled = stored ? JSON.parse(stored) : [];

    // prevent duplicate enroll
    const exists = enrolled.find((c) => c._id === course._id);
    if (exists) {
      Alert.alert("Information", "You already enrolled this course");
      return;
    }

    const enrolledCourses = {
      ...course,
      process: 0,
    }
    enrolled.push(enrolledCourses);
    await AsyncStorage.setItem(
      "enrolledCourses",
      JSON.stringify(enrolled)
    );

    Alert.alert("Success", "Course enrolled successfully");
    onSuccess?.()
    setModalVisible(false);
  } catch (err) {
    console.log("Enroll error:", err);
    Alert.alert("Error", "Failed to enroll course");
  }
};


  return (
    <TouchableOpacity
  style={styles.cartButton}
  onPress={() => {
    if (!isAuth) {
      Alert.alert("Login required", "Please login first");
      return;
    }
    handleEnroll(course);
  }}
>
  <Text style={styles.cartText}>
    {t("confirm_enroll", language)}
  </Text>
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
