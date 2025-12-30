import { useQuery } from "@apollo/client/react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import { GET_CONTENT_SECTION_WITH_PAGINATION } from "../../schema/course";
import VideoList from "./VideoList";

export default function CourseContent({
  courseId,
  onSelectVideo,
  completedVideo,
}) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const scrollRef = useRef(null);

  const { data, loading } = useQuery(GET_CONTENT_SECTION_WITH_PAGINATION, {
    variables: { page: 1, limit: 50, pagination: false, keyword: "", courseId },
  });

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#3F51B5"
        style={{ marginTop: 20 }}
      />
    );

  const sections = data?.getContentSectionWithPagination?.data || [];

  if (sections.length === 0)
    return (
      <Text style={styles.noContentText}>No course content available.</Text>
    );

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    onSelectVideo(video);
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Course Curriculum:</Text>

        {sections.map((section) => (
          <View key={section._id} style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() =>
                setExpandedSection(
                  expandedSection === section._id ? null : section._id
                )
              }
              activeOpacity={0.7}
            >
              <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
                <Text style={styles.sectionTitleText}>
                  Section {section.section_order}:
                </Text>
                <Text style={[styles.sectionTitleText, { marginLeft: 4 }]}>
                  {section.section_title}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={
                  expandedSection === section._id
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={22}
                color="#3F51B5"
              />
            </TouchableOpacity>

            <Divider />

            {expandedSection === section._id && (
              <VideoList
                sectionId={section._id}
                onSelectVideo={handleSelectVideo}
                activeVideoId={selectedVideo?._id}
                completedVideo={completedVideo}
              />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#2D3436",
  },
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
  noContentText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
    fontSize: 14,
  },
});
