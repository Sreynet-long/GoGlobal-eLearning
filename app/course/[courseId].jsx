import { useQuery } from "@apollo/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import CourseContent from "../../components/courses/CourseContent";
import { FILE_BASE_URL, IMAGE_BASE_URL } from "../../config/env";
import { GET_COURSE_BY_ID } from "../../schema/course";

const TABS = ["Course content", "Overview"];

export default function CoursePlayerScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Course content");
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const { data, loading } = useQuery(GET_COURSE_BY_ID, {
    variables: { courseById: courseId },
    skip: !courseId,
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3F51B5" />
      </View>
    );
  }

  const course = data?.getCourseById;
  const includes = course?.course_includes;

  /* ---------------- TAB RENDER ---------------- */
  const renderTabContent = () => {
    switch (activeTab) {
      case "Course content":
        return <CourseContent courseId={courseId} />;
      case "Overview":
        return renderOverview();
      default:
        return null;
    }
  };

  /* ---------------- OVERVIEW ---------------- */
  const renderOverview = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About this course:</Text>
        <InfoRow
          icon="tag-outline"
          label="Category"
          value={course?.category_id?.category_name}
        />
        <InfoRow
          icon="cash"
          label="Original price"
          value={`$${course?.original_price}`}
        />
        <InfoRow
          icon="sale"
          label="Sell price"
          value={`$${course?.sell_price}`}
        />
        <InfoRow
          icon="play-circle-outline"
          label="Lessons"
          value={includes?.number_of_lessons}
        />
        <InfoRow
          icon="video-outline"
          label="Videos"
          value={includes?.number_of_video}
        />
        <InfoRow
          icon="clock-outline"
          label="Total hours"
          value={includes?.number_of_hours}
        />
        <InfoRow
          icon="file-document-outline"
          label="Quizzes"
          value={includes?.number_quizzes}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This course includes:</Text>
        <IncludeItem
          text={`${includes?.number_of_hours} hours on-demand video`}
        />
        <IncludeItem
          text={`${includes?.number_of_downloadable_resources} downloadable resources`}
        />
        <IncludeItem
          text={`${includes?.number_of_projects_practices} projects & practices`}
        />
        {includes?.is_full_lifetime_access && (
          <IncludeItem text="Full lifetime access" />
        )}
        {includes?.has_certificate_of_completion && (
          <IncludeItem text="Certificate of completion" />
        )}
      </View>
    </View>
  );

  /* ---------------- VIDEO RENDER ---------------- */
  const renderVideo = () => {
    if (course?.video_url) {
      return (
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={{ uri: `${FILE_BASE_URL}/file/${course.video_url}` }}
            style={styles.videoWrapper}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={(status) => setIsPlaying(status.isPlaying)}
          />
          {!isPlaying && (
            <View style={styles.playOverlay}>
              <TouchableOpacity
                style={styles.playCircle}
                onPress={() => videoRef.current.playAsync()}
              >
                <MaterialCommunityIcons name="play" size={45} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }

    // fallback thumbnail if no video exists
    return (
      <View style={styles.videoWrapper}>
        <Image
          source={{ uri: `${IMAGE_BASE_URL}/file/${course?.thumbnail}` }}
          style={styles.videoWrapper}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course?.title}
        </Text>
      </View>

      {/* VIDEO */}
      {renderVideo()}

      {/* TABS */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
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
      </View>

      <Divider />

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <MaterialCommunityIcons name={icon} size={20} color="#3F51B5" />
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const IncludeItem = ({ text }) => (
  <View style={styles.includeRow}>
    <MaterialCommunityIcons name="check-circle" size={18} color="#4CAF50" />
    <Text style={styles.includeText}>{text}</Text>
  </View>
);

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", marginLeft: 10 },

  videoWrapper: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" },
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
  },

  tabBar: { flexDirection: "row", backgroundColor: "#FFF" },
  tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#3F51B5" },
  tabText: { color: "#999", fontWeight: "600" },
  activeTabText: { color: "#3F51B5" },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },

  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rowLabel: { flex: 1, marginLeft: 10, color: "#555" },
  rowValue: { fontWeight: "700" },

  includeRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  includeText: { marginLeft: 8 },
});
