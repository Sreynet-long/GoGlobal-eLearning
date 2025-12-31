import { useQuery } from "@apollo/client";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IMAGE_BASE_URL } from "../../config/env";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_FREE_WITH_PAGINATION } from "../../schema/courseHomepage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.55;

// ==================== Course Card Component ====================
const CourseCard = ({ title, thumbnail }) => {
  const imageUri = thumbnail
    ? `${IMAGE_BASE_URL}/file/${thumbnail}`
    : `${IMAGE_BASE_URL}/default/course.png`;

  return (
    <TouchableOpacity activeOpacity={0.95} style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.courseImage} />
      </View>

      <View style={styles.infoWrapper}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {String(title ?? "Untitled Course")}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.freeBadgeContainer}>
            <Text style={styles.freeBadgeText}>FREE</Text>
          </View>

          <View style={styles.dotSeparator} />

          <View style={styles.lessonCount}>
            <Text style={styles.lessonCountText}>{String(12) + " Lessons"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ==================== Main Component ====================
export default function FreeCourse() {
  const { language } = useLanguage();

  const { data, loading, error } = useQuery(GET_COURSE_FREE_WITH_PAGINATION, {
    variables: { limit: 10 },
  });

  if (loading)
    return <ActivityIndicator style={{ marginVertical: 30 }} color="#6366f1" />;

  if (error || !data?.getFreeCourse?.length) return null;

  const freeCourses = data?.getFreeCourse ?? [];

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            {String(t("start_learning_for_free", language))}
          </Text>
          <Text style={styles.subtitle}>
            {String("Unlock your potential today")}
          </Text>
        </View>

        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>
            {String(t("view_all", language))}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        snapToInterval={CARD_WIDTH + 20}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {freeCourses.map((course) => (
          <CourseCard
            key={String(course._id)}
            title={String(course.title ?? "Untitled Course")}
            thumbnail={course.thumbnail}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ==================== Styles ====================
const styles = StyleSheet.create({
  mainWrapper: { marginVertical: 15, marginHorizontal: 5 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 13, color: "#94a3b8", fontWeight: "500", marginTop: 2 },
  viewAllBtn: {
    backgroundColor: "#cbc0ff3f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewAllText: { fontSize: 13, color: "#6366f1", fontWeight: "800" },

  scrollContent: { paddingLeft: 10, paddingRight: 4, paddingBottom: 15 },

  cardContainer: {
    width: CARD_WIDTH,
    height: 220,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
    padding: 5,
    marginTop:10,
    marginBottom: 20,
  },
  imageWrapper: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  courseImage: {
    width: "100%",
    height: "100%",
  },
  freeBadgeContainer: {
    backgroundColor: "#10b98123",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  freeBadgeText: {
    color: "#10b981",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.1,
  },
  infoWrapper: {
    padding: 12,
    justifyContent: "space-between",
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
    lineHeight: 22,
    marginBottom: 2,
    minHeight: 14,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 2,
  },
  lessonCount: {
    backgroundColor: "#7db5ff59",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  lessonCountText: {
    fontSize: 15,
    color: "#3b82f6",
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 10,
  },
});
