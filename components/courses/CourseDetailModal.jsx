import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
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

// helper
const renderText = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) return "• " + value.join("\n• ");
  if (typeof value === "object") return "";
  return String(value);
};

export default function CourseDetailModal({ visible, course, onClose }) {
  const [fullCourse, setFullCourse] = useState(course);

  const { data } = useQuery(GET_COURSE_BY_ID, {
    variables: { courseId: course?._id },
    skip: !course || course.what_you_learn, 
  });

  useEffect(() => {
    if (data?.getCourseById) {
      setFullCourse(data.getCourseById);
    } else {
      setFullCourse(course);
    }
  }, [data, course]);

  if (!fullCourse) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHandle} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <Image
              source={{ uri: `${IMAGE_BASE_URL}/file/${fullCourse.thumbnail}` }}
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>
              {renderText(fullCourse.title)}
            </Text>

            {/* ===== ENROLLED / PRICE ===== */}
            {fullCourse.has_enrolled ? (
              fullCourse.has_course_completed ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.progressText}>
                    Progress: {fullCourse.overall_completion_percentage}%
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${fullCourse.overall_completion_percentage}%`,
                        },
                      ]}
                    />
                  </View>
                </>
              )
            ) : (
              <>
                <View style={styles.modalPriceRow}>
                  <Text style={styles.modalSellPrice}>
                    ${Number(fullCourse.sell_price).toFixed(2)}
                  </Text>
                  {fullCourse.original_price > fullCourse.sell_price && (
                    <Text style={styles.modalOldPrice}>
                      ${Number(fullCourse.original_price).toFixed(2)}
                    </Text>
                  )}
                </View>
                <EnrolledButton course={fullCourse} onSuccess={onClose} />
              </>
            )}

            {/* ===== COURSE INCLUDES ===== */}
            <View style={styles.sectionDivider}>
              <Text style={styles.includesTitle}>Course Includes:</Text>
              <Divider style={{ marginVertical: 10 }} />
              <CourseIncludes course={fullCourse} />
            </View>

            {/* ===== TEXT SECTIONS ===== */}
            <Section
              title="What you'll learn"
              
              value={fullCourse.what_you_learn}
            />
            <Section
              title="Who this course is for"
              value={fullCourse.who_this_course_is_for}
            />
            <Section title="Requirements" value={fullCourse.requirements} />
            <Section title="Description" value={fullCourse.description} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* ===== SMALL SUB COMPONENT ===== */
const Section = ({ title, value }) => (
  <View style={{ padding: 15 }}>
    <Text style={styles.title}>{title}:</Text>
    {value?.trim() ? (
      value.split("\n").map((line, i) => (
        <Text key={i} style={styles.paragraph}>
          • {line}
        </Text>
      ))
    ) : (
      <Text style={styles.emptyText}>No content here.</Text>
    )}
  </View>
);

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    maxHeight: SCREEN_HEIGHT * 0.84,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  modalImage: { width: "100%", height: 200, borderRadius: 15 },
  modalTitle: { fontSize: 22, fontWeight: "800", marginTop: 15 },
  modalPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  modalSellPrice: { fontSize: 28, fontWeight: "800", color: "#3F51B5" },
  modalOldPrice: {
    fontSize: 18,
    color: "#e61111ff",
    textDecorationLine: "line-through",
    marginLeft: 10,
  },
  sectionDivider: {
    marginTop: 20,
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
  },
  includesTitle: { fontWeight: "700", fontSize: 16 },
  progressText: { fontSize: 14, fontWeight: "600", color: "#3F51B5" },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginVertical: 8,
  },
  progressBar: { height: 10, backgroundColor: "#3F51B5" },
  completedBadge: {
    backgroundColor: "#E6F7E6",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  completedText: { color: "#2E7D32", fontWeight: "700" },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  paragraph: { fontSize: 16, lineHeight: 24, marginBottom: 6, color: "#333" },
  emptyText: { fontStyle: "italic", color: "#888" },
});
