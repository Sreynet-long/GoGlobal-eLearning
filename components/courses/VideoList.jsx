import { useQuery } from "@apollo/client/react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GET_VIDEO_CONTENT_WITH_PAGINATION } from "../../schema/course";

export default function VideoList({ sectionId, onSelectVideo }) {
  const { data, loading, error } = useQuery(GET_VIDEO_CONTENT_WITH_PAGINATION, {
    variables: {
      contentSectionId: sectionId,
      page: 1,
      limit: 30,
      pagination: false,
      keyword: "",
    },
    skip: !sectionId,
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color="rgba(17, 34, 189, 1)"
        style={{ margin: 12 }}
      />
    );
  }

  if (error) {
    console.log("video query error:", error);
    return (
      <Text style={{ color: "red", padding: 12 }}>Failed to load videos</Text>
    );
  }

  const videos = data?.getVideoContentWithPagination?.data || [];

  if (videos.length === 0) {
    return (
      <Text style={{ padding: 12, color: "#999" }}>
        No videos in this section
      </Text>
    );
  }

  return (
    <View>
      {videos.map((video) => (
        <TouchableOpacity
          key={video._id}
          style={styles.lessonRow}
          onPress={() => onSelectVideo?.(video)} 
        >
          <MaterialCommunityIcons
            name="play-circle-outline"
            size={20}
            color="#888"
          />

          <View style={styles.lessonInfo}>
            <Text style={styles.lessonTitle}>
              {video.video_content_order}. {video.video_content_name}
            </Text>
            <Text style={styles.lessonDuration}>Video</Text>
          </View>

          {video.resources?.length > 0 && (
            <MaterialCommunityIcons
              name="file-download-outline"
              size={18}
              color="#3F51B5"
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
