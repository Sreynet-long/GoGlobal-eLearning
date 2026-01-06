import { useQuery } from "@apollo/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useMemo } from "react";
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
import { useVideoCompletion } from "../../components/courses/useVideoCompletion";
import { FILE_BASE_URL, IMAGE_BASE_URL } from "../../config/env";
import { GET_COURSE_BY_ID } from "../../schema/course";

const TABS = ["Course content", "Overview"];

export default function CoursePlayerScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const videoRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Course content");
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { data, loading } = useQuery(GET_COURSE_BY_ID, {
    variables: { courseId },
    skip: !courseId,
    fetchPolicy: "cache-and-network",
  });

  const enrolledId = data?.getCourseById?.enrolled_id;

  // const [completedVideoIds, setCompletedVideoIds] = useState([]);

  // Sync backend completed videos
  // useEffect(() => {
  //   const backendCompleted = data?.getCourseById?.completedVideo || [];
  //   setCompletedVideoIds((prev) => [
  //     ...new Set([...(prev || []), ...backendCompleted]),
  //   ]);
  // }, [data]);

  // const backendCompleted = data?.getCourseById?.completedVideo || [];

  const completedFromBackend = useMemo(() => {
    if (!data?.getVideoContentWithPagination?.data) return [];
    return data.getVideoContentWithPagination.data
      .filter((v) => v.has_completed === true)
      .map((v) => v._id);
  }, [data]);

  const { completedVideoIds, toggleVideoComplete } = useVideoCompletion(
    enrolledId,
    courseId,
    completedFromBackend,
  );

  const handleVideoFinish = (video) => {
    if (!completedVideoIds.includes(video._id))
      toggleVideoComplete(video._id, true);
  };

  // const handleVideoComplete = async (video) => {
  //   markVideoComplete(video._id);
  // };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3F51B5" />
      </View>
    );
  }

  const course = data?.getCourseById;
  const includes = course?.course_includes;

  const renderTabContent = () => {
    switch (activeTab) {
      case "Course content":
        return (
          <CourseContent
            courseId={courseId}
            onSelectVideo={setSelectedVideo}
            completedVideo={completedVideoIds}
            onToggleComplete={toggleVideoComplete}
          />
        );
      case "Overview":
        return renderOverview();
      default:
        return null;
    }
  };

  const renderOverview = () => (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
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
          value={course?.original_price ? `$${course?.original_price}` : "-"}
        />
        <InfoRow
          icon="sale"
          label="Sell price"
          value={course?.sell_price ? `$${course.sell_price}` : "Free"}
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
        <View>
          <IncludeItem
            text={`${includes?.number_of_downloadable_resources} downloadable resources`}
            icon="download-outline"
          />
          <IncludeItem
            text={`${includes?.number_of_projects_practices} projects & practices`}
            icon="briefcase-outline"
          />
          {includes?.is_full_lifetime_access && (
            <IncludeItem text="Full lifetime access" icon="infinity" />
          )}
          {includes?.has_certificate_of_completion && (
            <IncludeItem
              text="Certificate of completion"
              icon="certificate-outline"
            />
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What you will learn:</Text>
        <ParagraphList
          text={course?.what_you_learn}
          icon="check-circle-outline"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Who this course is for:</Text>
        <ParagraphList
          text={course?.who_this_course_is_for}
          icon="account-outline"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Requirements:</Text>
        <ParagraphList text={course?.requirements} icon="tools" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Description:</Text>
        <ParagraphList text={course?.description} />
      </View>
    </ScrollView>
  );

  const renderVideo = () => {
    if (selectedVideo) {
      return (
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={{ uri: FILE_BASE_URL + selectedVideo.video_src }} 
            style={styles.videoWrapper}
            useNativeControls
            resizeMode="contain"
            shouldPlay={true}
            isLooping={false}
            onPlaybackStatusUpdate={(status) =>
              status.didJustFinish && handleVideoFinish(selectedVideo)
            }
          />
        </View>
      );
    }

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

  const ParagraphList = ({ text, icon }) => {
    if (!text)
      return <Text style={styles.emptyText}>No content available</Text>;
    return text.split("\n").map((line, index) => (
      <View key={index} style={styles.listItem}>
        <MaterialCommunityIcons name={icon} size={18} color="#3F51B5" />
        <Text style={styles.listText}>{line}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course?.title}
        </Text>
      </View>

      {renderVideo()}

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
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== SMALL COMPONENTS ==================== //
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <MaterialCommunityIcons name={icon} size={20} color="#3F51B5" />
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);
const IncludeItem = ({ text, label, value, icon }) => (
  <View style={styles.includeRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#3F51B5" />
    <Text style={styles.includeText}>{text}</Text>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

// ==================== STYLES ==================== //
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
  tabText: { color: "#999", fontWeight: "700", fontSize: 16 },
  activeTabText: { color: "#3F51B5" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  listItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  listText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#444",
    marginLeft: 8,
    flex: 1,
  },
  emptyText: { fontSize: 16, fontStyle: "italic", color: "#999" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rowLabel: { flex: 1, marginLeft: 10 },
  rowValue: { fontWeight: "700" },

  includeRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  includeText: { marginLeft: 8 },
});
