import { useQuery } from "@apollo/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router"; 
import { useState } from "react";
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
import { GET_COURSE_BY_ID } from "../../schema/course";
import { IMAGE_BASE_URL } from "../../config/env";

const { width } = Dimensions.get("window");
const TABS = ["Course content", "Q&A", "Notes"];

export default function CoursePlayerScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams(); // Get the ID from the URL/Params
  const [activeTab, setActiveTab] = useState("Course content");
  const [expandedSection, setExpandedSection] = useState(3);
  const [currentLessonId, setCurrentLessonId] = useState(4);

  // --- GraphQL Integration ---
  const { data, loading, error } = useQuery(GET_COURSE_BY_ID, {
    variables: { courseById: courseId },
    skip: !courseId,
  });

  // Handle Loading State
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3F51B5" />
      </View>
    );
  }

  // Handle Error or Empty State
  if (error || !data?.getCourseById) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Error loading course content.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: "#3F51B5" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const course = data.getCourseById;

  // Mock sections (Note: If your schema had a 'curriculum' field, we would map course.curriculum here)
  const sections = [
    { id: 1, title: "Section 1: Course Agenda", lessons: 4, time: "10min",items: [
        {
          id: 3,
          title: "1. Introduction to the concept",
          duration: "28min",
          completed: true,
          hasResources: true,
        },
        {
          id: 4,
          title: "2. Setting up the project",
          duration: "32min",
          completed: true,
        },
        {
          id: 5,
          title: "3. Advanced implementation",
          duration: "22min",
          completed: false,
        },
      ], },
    { id: 2, title: "Section 2: Environment Setup", lessons: 5, time: "23min",items: [
        {
          id: 3,
          title: "1. Introduction to the concept",
          duration: "28min",
          completed: true,
          hasResources: true,
        },
        {
          id: 4,
          title: "2. Setting up the project",
          duration: "32min",
          completed: true,
        },
        {
          id: 5,
          title: "3. Advanced implementation",
          duration: "22min",
          completed: false,
        },
      ], },
    {
      id: 3,
      title: "Section 3: Deep Dive into Topics",
      lessons: 7,
      time: "2hr 59min",
      items: [
        {
          id: 3,
          title: "1. Introduction to the concept",
          duration: "28min",
          completed: true,
          hasResources: true,
        },
        {
          id: 4,
          title: "2. Setting up the project",
          duration: "32min",
          completed: true,
        },
        {
          id: 5,
          title: "3. Advanced implementation",
          duration: "22min",
          completed: false,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* --- Video Player Section --- */}
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: `${IMAGE_BASE_URL}/file/${course.thumbnail}` }} 
          style={styles.videoPlaceholder}
        />
        <View style={styles.playOverlay}>
          <MaterialCommunityIcons name="play-circle" size={80} color="white" />
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic Title Block from GraphQL */}
        <View style={styles.titlePadding}>
          <Text style={styles.courseTitle} numberOfLines={1}>
            {course.title}
          </Text>
        </View>

        {/* Tabs Bar */}
        <View style={styles.tabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabItem,
                  activeTab === tab && styles.activeTabItem,
                ]}
              >
                {tab === "" && (
                  <MaterialCommunityIcons
                    name="sparkles"
                    size={14}
                    color={activeTab === tab ? "#3F51B5" : "#666"}
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Curriculum List */}
        <View style={styles.curriculumContainer}>
          {sections.map((section) => (
            <View key={section.id} style={styles.sectionWrapper}>
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
                    {section.lessons}/{section.lessons} | {section.time}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name={
                    expandedSection === section.id
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={20}
                  color="#444"
                />
              </TouchableOpacity>

              {expandedSection === section.id &&
                section.items?.map((lesson) => (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[
                      styles.lessonItem,
                      currentLessonId === lesson.id && styles.activeLesson,
                    ]}
                    onPress={() => setCurrentLessonId(lesson.id)}
                  >
                    <MaterialCommunityIcons
                      name={
                        lesson.completed
                          ? "checkbox-marked"
                          : "checkbox-blank-outline"
                      }
                      size={20}
                      color={lesson.completed ? "#3F51B5" : "#CCC"}
                    />
                    <View style={styles.lessonInfo}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <View style={styles.lessonMeta}>
                        <MaterialCommunityIcons
                          name="play-display"
                          size={12}
                          color="#888"
                        />
                        <Text style={styles.durationText}>
                          {lesson.duration}
                        </Text>
                      </View>
                    </View>
                    {lesson.hasResources && (
                      <View style={styles.resourceBadge}>
                        <MaterialCommunityIcons
                          name="folder-outline"
                          size={14}
                          color="#3F51B5"
                        />
                        <Text style={styles.resourceText}>Resources</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  center: { justifyContent: "center", alignItems: "center" },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    position: "relative",
  },
  videoPlaceholder: { width: "100%", height: "100%", opacity: 0.7 },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: { position: "absolute", top: 15, left: 15 },
  titlePadding: { padding: 15, backgroundColor: "#1A1A1A" },
  courseTitle: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  tabsWrapper: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  tabsContainer: { paddingHorizontal: 10, height: 50, alignItems: "center" },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabItem: { borderBottomColor: "#3F51B5" },
  tabText: { color: "#666", fontWeight: "600", fontSize: 13 },
  activeTabText: { color: "#3F51B5" },
  curriculumContainer: { paddingVertical: 10 },
  sectionWrapper: { borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#F8F9FA",
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubText: { fontSize: 11, color: "#777" },
  lessonItem: {
    flexDirection: "row",
    padding: 15,
    paddingLeft: 20,
    alignItems: "flex-start",
  },
  activeLesson: { backgroundColor: "#F0F2FF" },
  lessonInfo: { flex: 1, marginLeft: 12 },
  lessonTitle: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    fontWeight: "500",
  },
  lessonMeta: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  durationText: { fontSize: 11, color: "#888", marginLeft: 4 },
  resourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3F51B5",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resourceText: {
    color: "#3F51B5",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
});
