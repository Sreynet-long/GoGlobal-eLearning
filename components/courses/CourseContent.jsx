import { useMutation, useQuery } from "@apollo/client/react";
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
import {
  GET_CONTENT_SECTION_WITH_PAGINATION
} from "../../schema/course";
import VideoList from "./VideoList";

export default function CourseContent({ courseId, onSelectVideo, completedVideo }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(false);
  const scrollRef = useRef(null);

  const { data, loading } = useQuery(GET_CONTENT_SECTION_WITH_PAGINATION, {
    variables: { page: 1, limit: 50, pagination: false, keyword: "", courseId },
  });

  if (loading) return <ActivityIndicator size="large" color="#3F51B5" />;

  const sections = data?.getContentSectionWithPagination?.data || [];

  const handleSelectVideo = async (video) => {
    setSelectedVideo(video);
    onSelectVideo(video);
    // scroll to top to show video player
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <ScrollView ref={scrollRef} style={{ flex: 1 }}>
      {/* VIDEO PLAYER */}
      {/* {selectedVideo && <VideoPlayer video={selectedVideo} />} */}

      {/* COURSE CURRICULUM */}
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
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text style={styles.sectionTitleText}>
                  Section {section.section_order}:{" "}
                </Text>
                <Text style={styles.sectionTitleText}>
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
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
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
});
