import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { CREATE_COURSE_ENROLLED } from "../../schema/course";

export default function EnrolledButton({ course, onSuccess }) {
  const { language } = useLanguage();
  const { isAuth } = useAuth();
  const router = useRouter();

  const [createCourseEnrolled, { loading }] = useMutation(CREATE_COURSE_ENROLLED, {
    refetchQueries: [""]
  });

  const handleEnroll = async () => {
    try {
      const { data } = await createCourseEnrolled({
        variables: { input: { course_id: course._id } },
      });

      const enroll = data?.createCourseEnrolled;

      if (!enroll) {
        Alert.alert("Error", "Something went wrong!");
        return;
      }

      if (!enroll.status) {
        Alert.alert("Information", "You already enrolled in this course.");
        return;
      }

      // onSuccess?.();
      setTimeout(() => {
      Alert.alert("Success", "Course enrolled successfully!", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(tabs)/myCourses&Login");

          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }, 50);
      
    } catch (err) {
      console.log("Enroll error:", err);
      Alert.alert("Error", "Enroll failed. Please try again.");
    }
  };

  const handleLoginRequired = () => {
    Alert.alert("Login required", "Please login first", [
      {
        text: "OK",
        onPress: () => router.replace("/(tabs)/myCourses&Login"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.cartButton, loading && { opacity: 0.6 }]}
      disabled={loading}
      onPress={() => {
        if (!isAuth) {
          handleLoginRequired();
          return;
        }
        handleEnroll();
      }}
    >
      <Text style={styles.cartText}>
        {loading ? "Enrolling..." : t("confirm_enroll", language)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = {
  cartButton: {
    backgroundColor: "#58589bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cartText: {
    color: "#fff",
    fontWeight: "bold",
  },
};
