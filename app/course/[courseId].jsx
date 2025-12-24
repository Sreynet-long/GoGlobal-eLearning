import { useQuery } from "@apollo/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { IMAGE_BASE_URL } from "../../config/env";
import { GET_COURSE_BY_ID } from "../../schema/course";

const { width } = Dimensions.get("window");

export default function CoursePlayerScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Course content");
  const [expandedSection, setExpandedSection] = useState(1);
  const [currentLessonId, setCurrentLessonId] = useState(3);

  const { data, loading, error } = useQuery(GET_COURSE_BY_ID, {
    variables: { courseById: courseId },
    skip: !courseId,
  });

  // --- 1. Fix ReferenceError by defining data properly ---
  const sections = useMemo(
    () => [
      {
        id: 1,
        title: "Section 1: Course Agenda",
        lessons: 3,
        time: "10min",
        items: [
          {
            id: 1,
            title: "Welcome to the course",
            duration: "02:30",
            completed: true,
          },
          {
            id: 2,
            title: "How to get help",
            duration: "05:00",
            completed: true,
          },
          {
            id: 3,
            title: "Downloadable Resources",
            duration: "03:00",
            completed: false,
            hasResources: true,
          },
        ],
      },
      {
        id: 2,
        title: "Section 2: Setup & Installation",
        lessons: 2,
        time: "45min",
        items: [
          {
            id: 4,
            title: "Installing Dependencies",
            duration: "20:00",
            completed: false,
          },
          {
            id: 5,
            title: "Environment Configuration",
            duration: "25:00",
            completed: false,
          },
        ],
      },
    ],
    []
  );

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3F51B5" />
      </View>
    );

  const course = data?.getCourseById;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* --- Fixed Video Player --- */}
      <View style={styles.videoWrapper}>
        <Image
          source={{ uri: `${IMAGE_BASE_URL}/file/${course?.thumbnail}` }}
          style={styles.videoPlaceholder}
        />
        <View style={styles.playOverlay}>
          <TouchableOpacity style={styles.playCircle}>
            <MaterialCommunityIcons name="play" size={45} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.backFab} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Course Info Header --- */}
        <View style={styles.headerContent}>
          <Text style={styles.courseTitle} numberOfLines={2}>
            {course?.title || "Course Loading..."}
          </Text>
        </View>

        {/* --- Sticky Tabs --- */}
        <View style={styles.tabBar}>
          {["Course content", "Q&A", "Notes"].map((tab) => (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabScrollContent}
            >
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === tab && styles.activeTabLabel,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          ))}
        </View>

        {/* --- Curriculum List --- */}
        <View style={styles.contentBody}>
          {activeTab === "Course content" ? (
            sections.map((section) => (
              <View key={section.id} style={styles.sectionCard}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() =>
                    setExpandedSection(
                      expandedSection === section.id ? null : section.id
                    )
                  }
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitleText}>{section.title}</Text>
                    <Text style={styles.sectionSubText}>
                      {section.lessons} lessons • {section.time}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={
                      expandedSection === section.id
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={22}
                    color="#3F51B5"
                  />
                </TouchableOpacity>

                {expandedSection === section.id &&
                  section.items.map((lesson) => (
                    <TouchableOpacity
                      key={lesson.id}
                      style={[
                        styles.lessonRow,
                        currentLessonId === lesson.id && styles.activeLessonRow,
                      ]}
                      onPress={() => setCurrentLessonId(lesson.id)}
                    >
                      <MaterialCommunityIcons
                        name={
                          lesson.completed
                            ? "check-circle"
                            : "play-circle-outline"
                        }
                        size={20}
                        color={lesson.completed ? "#4CAF50" : "#888"}
                      />
                      <View style={styles.lessonInfo}>
                        <Text
                          style={[
                            styles.lessonTitle,
                            currentLessonId === lesson.id &&
                              styles.activeLessonText,
                          ]}
                        >
                          {lesson.title}
                        </Text>
                        <Text style={styles.lessonDuration}>
                          {lesson.duration}
                        </Text>
                      </View>
                      {lesson.hasResources && (
                        <MaterialCommunityIcons
                          name="file-download-outline"
                          size={18}
                          color="#3F51B5"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="Information-outline"
                size={40}
                color="#DDD"
              />
              <Text style={styles.emptyText}>
                No {activeTab} for this course yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Video Header
  videoWrapper: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" },
  videoPlaceholder: { width: "100%", height: "100%", opacity: 0.6 },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(63, 81, 181, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 5,
  },
  backFab: {
    position: "absolute",
    top: 20,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 4,
  },

  // Progress UI
  headerContent: { padding: 20, backgroundColor: "#FFF" },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 12,
  },
  progressRow: { flexDirection: "row", alignItems: "center" },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginRight: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  progressText: { fontSize: 12, color: "#636E72", fontWeight: "600" },

  // Tabs UI
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  tab: {
    flex: 1,
    flexDirection:"row",
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabScrollContent: {paddingHorizontal: 10, flexDirection: "row"},
  activeTab: { borderBottomColor: "#3F51B5" },
  tabLabel: { fontSize: 14, color: "#B2BEC3", fontWeight: "700" },
  activeTabLabel: { color: "#3F51B5" },

  // Curriculum UI
  contentBody: { padding: 16 },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  sectionTitleText: { fontSize: 15, fontWeight: "700", color: "#2D3436" },
  sectionSubText: { fontSize: 12, color: "#ADADAD", marginTop: 2 },

  // Lesson Rows
  lessonRow: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F8F9FA",
    alignItems: "center",
  },
  activeLessonRow: { backgroundColor: "#F0F3FF" },
  lessonInfo: { flex: 1, marginLeft: 12 },
  lessonTitle: { fontSize: 14, color: "#636E72", fontWeight: "500" },
  activeLessonText: { color: "#3F51B5", fontWeight: "700" },
  lessonDuration: { fontSize: 11, color: "#B2BEC3", marginTop: 2 },

  // Empty State
  emptyState: { padding: 50, alignItems: "center" },
  emptyText: { color: "#B2BEC3", marginTop: 10 },
});
