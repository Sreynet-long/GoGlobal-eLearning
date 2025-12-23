import { useMutation } from "@apollo/client/react";
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

  const [createCourseEnrolled, { loading }] = useMutation(
    CREATE_COURSE_ENROLLED
  );

  const handleEnroll = async () => {
    try {
      const { data } = await createCourseEnrolled({
        variables: {
          input: {
            course_id: course._id,
          },
        },
      });

      const enroll = data?.createCourseEnrolled;

      if (!enroll) {
        Alert.alert("Error", "Something went wrong!");
        return;
      }

      if (!enroll.status) {
        Alert.alert("Information" , "You already enrolled this course.");
        return;
      }

        Alert.alert(
          "Sucess",
          "Course enrolled successfully!"
          );
          onSuccess();
      } catch (err) {
        console.log("Enroll error:", err);
        Alert.alert("Error", "Enroll failed");
    }
  };

  const handleLoginRequired = () => {
    Alert.alert("Login required", "Please login first", [
      {
        text: "OK",
        style: "ok",
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
