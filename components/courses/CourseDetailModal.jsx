import { useQuery } from "@apollo/client";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import { IMAGE_BASE_URL } from "../../config/env";
import { GET_COURSE_BY_ID } from "../../schema/course";
import CourseIncludes from "./CourseInclude";
import EnrolledButton from "./EnrolledButton";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/* ---------------- Helper ---------------- */
const renderText = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) return "• " + value.join("\n• ");
  if (typeof value === "object") return "";
  return String(value);
};

const getProgress = (course) => {
  const value = Number(course?.overall_completion_percentage);
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
};

/* ---------------- Component ---------------- */
export default function CourseDetailModal({ visible, course, onClose }) {
  const [fullCourse, setFullCourse] = useState(course);

  const { data } = useQuery(GET_COURSE_BY_ID, {
    variables: { courseId: course?._id },
    skip: !course || course?.what_you_learn,
  });

  useEffect(() => {
    if (data?.getCourseById) {
      setFullCourse(data.getCourseById);
    } else {
      setFullCourse(course);
    }
  }, [data, course]);

  if (!fullCourse) return null;

  const progress = getProgress(fullCourse);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.wrapper}
      >
        <View style={styles.modal}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* SCROLLABLE CONTENT */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Image
              source={{ uri: `${IMAGE_BASE_URL}/file/${fullCourse.thumbnail}` }}
              style={styles.image}
            />

            <Text style={styles.title}>{renderText(fullCourse.title)}</Text>

            {/* PRICE / PROGRESS */}
            {fullCourse.has_enrolled ? (
              fullCourse.has_course_completed ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.progressText}>Progress: {progress}%</Text>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${progress}%` },
                      ]}
                    />
                  </View>
                </>
              )
            ) : (
              <>
                <View style={styles.priceRow}>
                  <Text style={styles.sellPrice}>
                    ${Number(fullCourse.sell_price).toFixed(2)}
                  </Text>
                  {fullCourse.original_price > fullCourse.sell_price && (
                    <Text style={styles.oldPrice}>
                      ${Number(fullCourse.original_price).toFixed(2)}
                    </Text>
                  )}
                </View>
                <EnrolledButton course={fullCourse} onSuccess={onClose} />
              </>
            )}

            {/* COURSE INCLUDES */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Course Includes:</Text>
              <Divider style={{ marginVertical: 10 }} />
              <CourseIncludes course={fullCourse} />
            </View>

            {/* TEXT SECTIONS */}
            <View style={styles.textSectionContainer}>
              <Section
                title="What you'll learn"
                value={fullCourse.what_you_learn}
                icon="check-circle-outline"
              />
              <Section
                title="Who this course is for"
                value={fullCourse.who_this_course_is_for}
                icon="account-outline"
              />
              <Section
                title="Requirements"
                value={fullCourse.requirements}
                icon="tools"
              />
              <Section title="Description" value={fullCourse.description} />
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ---------------- Sub Component ---------------- */
const Section = ({ title, value, icon }) => (
  <View style={styles.textSection}>
    <Text style={styles.sectionTitle}>{title}:</Text>
    {value?.trim() ? (
      value.split("\n").map((line, i) => (
        <View key={i} style={styles.listItem}>
          <MaterialCommunityIcons name={icon} size={18} color="#3F51B5" />
          <Text style={styles.paragraph}>{line}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.emptyText}>No content here.</Text>
    )}
  </View>
);

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  modal: {
    backgroundColor: "#fff",
    maxHeight: SCREEN_HEIGHT * 0.84,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },

  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginVertical: 12,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 16,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },

  sellPrice: {
    fontSize: 28,
    fontWeight: "800",
    color: "#3F51B5",
  },

  oldPrice: {
    fontSize: 18,
    color: "#e61111ff",
    textDecorationLine: "line-through",
    marginLeft: 10,
  },

  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3F51B5",
    marginTop: 10,
  },

  progressBarBg: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginTop: 6,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#3F51B5",
  },

  completedBadge: {
    backgroundColor: "#E6F7E6",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: "flex-start",
  },

  completedText: {
    color: "#2E7D32",
    fontWeight: "700",
  },

  sectionBox: {
    marginTop: 20,
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
  },

  textSection: {
    paddingVertical: 7,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  listItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },

  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
    color: "#333",
    marginLeft: 8,
  },

  emptyText: {
    fontStyle: "italic",
    color: "#888",
  },
  textSectionContainer: {
    padding: 15,
  },
});
