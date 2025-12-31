import { useEffect, useRef } from "react";
import {
  Animated,
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
import CourseIncludes from "./CourseInclude";
import EnrolledButton from "./EnrolledButton";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const renderText = (value) => {
  if (!value) return null;

  if (Array.isArray(value)) {
     return (
    <View>
      {includes.map((item, index) => (
        <Text key={index} style={{ fontSize: 14, marginBottom: 5 }}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

  if (typeof value === "object") return null;

  return <Text style={styles.sectionText}>{String(value)}</Text>;
};

export default function CourseDetailModal({ visible, onClose, course }) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (course?.overall_completion_percentage != null) {
      Animated.timing(progressAnim, {
        toValue: Number(course.overall_completion_percentage),
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [course]);

  if (!course) return null;

  const includes = course?.course_includes;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHandle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {course.thumbnail && (
              <Image
                source={{ uri: `${IMAGE_BASE_URL}/file/${course.thumbnail}` }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}

            <Text style={styles.modalTitle}>{String(course.title)}</Text>

            {course.has_enrolled ? (
              course.has_course_complated ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.progressText}>
                    Progress:{" "}
                    {Number(course.overall_completion_percentage || 0)}%
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <Animated.View
                      style={[
                        styles.progressBar,
                        {
                          width: progressAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: ["0%", "100%"],
                          }),
                        },
                      ]}
                    />
                  </View>
                </>
              )
            ) : (
              <>
                {course.sell_price != null && (
                  <View style={styles.modalPriceRow}>
                    <Text style={styles.modalSellPrice}>
                      ${Number(course.sell_price).toFixed(2)}
                    </Text>
                    {course.original_price &&
                      course.original_price > course.sell_price && (
                        <Text style={styles.modalOldPrice}>
                          ${Number(course.original_price).toFixed(2)}
                        </Text>
                      )}
                  </View>
                )}
                <EnrolledButton course={course} onSuccess={onClose} />
              </>
            )}

            <View style={styles.sectionDivider}>
              <Text style={styles.includesTitle}>Course Includes:</Text>
              <Divider style={{ marginVertical: 10 }} />
              {includes ? (
                <CourseIncludes course={course} />
              ) : (
                <Text style={styles.emptyText}>• No course details available</Text>
              )}
            </View>

            <View style={styles.sectionBox}>
              <Text style={styles.includesTitle}>What you'll learn:</Text>
              <Divider style={{ marginVertical: 8 }} />
              {renderText(course.what_you_learn)}
            </View>

            <View style={styles.sectionBox}>
              <Text style={styles.includesTitle}>Who this course is for:</Text>
              <Divider style={{ marginVertical: 8 }} />
              {renderText(course.who_this_course_is_for)}
            </View>

            <View style={styles.sectionBox}>
              <Text style={styles.includesTitle}>Requirements:</Text>
              <Divider style={{ marginVertical: 8 }} />
              {renderText(course.requirements)}
            </View>

            <View style={styles.sectionBox}>
              <Text style={styles.includesTitle}>Description:</Text>
              <Divider style={{ marginVertical: 8 }} />
              {renderText(course.description)}
            </View>

            <View style={{ height: 30 }} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT * 0.86,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 10,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  scrollContent: { paddingBottom: 20 },
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
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 10,
  },
  includesTitle: { fontWeight: "700", fontSize: 16 },
  sectionDivider: {
    marginTop: 20,
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
  },
  sectionBox: {
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
  },
  sectionText: { fontSize: 14, lineHeight: 20 },
  progressText: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginVertical: 8,
    overflow: "hidden",
  },
  progressBar: { height: 10, backgroundColor: "#3F51B5", borderRadius: 5 },
  completedBadge: {
    backgroundColor: "#E6F7E6",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  completedText: { color: "#2E7D32", fontWeight: "700" },
  emptyText: {
    fontSize: 15,
    color: "#999",
    fontStyle: "italic",
    marginTop: 5,
  },
});
