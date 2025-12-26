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
const CARD_WIDTH = width * 0.4;

// ==================== Course Card Component ====================
const CourseCard = ({ title, thumbnail }) => {
  const imageUri = thumbnail
    ? `${IMAGE_BASE_URL}/file/${thumbnail}`
    : `${IMAGE_BASE_URL}/default/course.png`;

  return (
    <TouchableOpacity activeOpacity={0.95} style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.courseImage} />
        <View style={styles.freeBadgeContainer}>
          <Text style={styles.freeBadgeText}>FREE</Text>
        </View>
      </View>

      <View style={styles.infoWrapper}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.lessonCount}>
            <Text style={styles.lessonCountText}>12 Lessons</Text>
          </View>
          <View style={styles.dotSeparator} />
          <Text style={styles.difficultyText}>Beginner</Text>
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
            {t("start_learning_for_free", language)}
          </Text>
          <Text style={styles.subtitle}>Unlock your potential today</Text>
        </View>

        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>{t("view_all", language)}</Text>
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
            key={course._id}
            title={course.title}
            thumbnail={course.thumbnail}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ==================== Redesigned Styles ====================
const styles = StyleSheet.create({
  mainWrapper: { marginVertical: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 13, color: "#94a3b8", fontWeight: "500", marginTop: 2 },
  viewAllBtn: {
    backgroundColor: "#f5f3ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewAllText: { fontSize: 13, color: "#6366f1", fontWeight: "800" },

  scrollContent: { paddingLeft: 20, paddingRight: 4, paddingBottom: 15 },

  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 24,
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  imageWrapper: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  courseImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  freeBadgeContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#10b981",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  freeBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  infoWrapper: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
    lineHeight: 22,
    marginBottom: 12,
    minHeight: 14,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
  },
  lessonCount: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lessonCountText: {
    fontSize: 11,
    color: "#3b82f6",
    fontWeight: "700",
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 10,
  },
  difficultyText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
});
