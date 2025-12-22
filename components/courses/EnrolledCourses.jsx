import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import EmptyCourse from "./EmptyCourse";
import { IMAGE_BASE_URL } from "../../config/env";

export default function EnrolledCourses({ selectedCategoryId }) {
  const { language } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- Load enrolled courses ----------
  const loadEnrolledCourses = async () => {
    try {
      const stored = await AsyncStorage.getItem("enrolledCourses");
      setCourses(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.log("Load enrolled error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  // ---------- Filter by category ----------
  const filteredCourses =
    selectedCategoryId === "All"
      ? courses
      : courses.filter(
          (c) => c.category_id?._id === selectedCategoryId
        );

  // ---------- Loading ----------
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#58589bff" />
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.textHeader}>
        {t("courses_enrolled_list", language)}
      </Text>

      {filteredCourses.length === 0 ? (
        <EmptyCourse />
      ) : (
        filteredCourses.map((course) => (
          <TouchableOpacity style={styles.card} key={course._id}>
            <Image
              source={{
                uri: `${IMAGE_BASE_URL}/file/${course.thumbnail}`,
              }}
              style={styles.cardImage}
            />

            <View style={styles.cardBody}>
              <Text style={styles.textTitle}>{course.title}</Text>

              <Text style={styles.textHours}>
                {course.course_includes?.number_of_hours ?? 0}{" "}
                {t("hours", language)}
              </Text>
              <View style={{paddingTop: 10}}>
                <View>
                <Text style={styles.progressBarContainer} />
                <Text style={[ { width: `${course.progress}%` }]}/>
                </View> 
                <Text style={styles.progressText}>
                  {course.progress ?? 0}% {t("completed", language)}
                </Text> 
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textHeader: { fontSize: 18, fontWeight: "700", marginVertical: 10 },
  textTitle: { paddingVertical: 5, fontSize: 16 },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  cardImage: { width: "40%", height: 120, resizeMode: "cover" },
  cardBody: { flex: 1, padding: 10, justifyContent: "center" },
  textHours: { fontSize: 14, color: "#666" },
  loadingContainer: {
    marginTop: 150,
    alignItems: "center",
  },

  progressBarContainer: {
    flex: 1,
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginRight: 10,
    overflow: "hidden",
  },
  progressBar: {
    backgroundColor: "#25375aff",
    borderRadius: 4,
    height: 4,
    marginRight: 10
  },
  progressText: {
    fontSize: 12,
    color: "#25375aff",
  },
});
