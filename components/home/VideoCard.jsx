import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { RESUME_LESSON } from "../../schema/courseHomepage";
export default function VideoCard() {
  const { language } = useLanguage();
  const router = useRouter();
  const isAuth = useAuth();

  const { data, refetch, loading, error } = useQuery(RESUME_LESSON, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    refetch();
  }, [isAuth]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#22c55e" />
      </View>
    );
  }

  const course = data?.getResumeLearning;
  if (error || !course) return null;

  const progress = course.overall_completion_percentage ?? 0;

  const handlePress = () => {
    router.push({
      pathname: "/course/[courseId]",
      params: { courseId: course.course_id },
    });
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={handlePress}
      >
        <View style={styles.topRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="play" size={18} color="#ffffff" />
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>
              {(
                t("RESUME_LEARNING", language) || "RESUME LEARNING"
              ).toUpperCase()}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {course.title}
            </Text>
          </View>

          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>{progress}%</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  loaderContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffffff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000000ff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f3f3f3ff",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 21,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: "#22c55e",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  percentageContainer: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#16a34a",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 3,
  },
});
