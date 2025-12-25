import { useQuery } from "@apollo/client/react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import { GET_VIDEO_CONTENT_WITH_PAGINATION } from "../../schema/course";
import { FILE_BASE_URL } from "../../config/env";

export default function VideoList({ sectionId, onSelectVideo, activeVideoId }) {
  const { data, loading, error } = useQuery(GET_VIDEO_CONTENT_WITH_PAGINATION, {
    variables: {
      contentSectionId: sectionId,
      page: 1,
      limit: 50,
      pagination: false,
      keyword: "",
    },
    skip: !sectionId,
    fetchPolicy: "network-only",
  });

  if (loading) return <ActivityIndicator style={{ margin: 12 }} />;
  if (error) return <Text style={{ color: "red", padding: 12 }}>Failed to load videos</Text>;

  // REMOVE DUPLICATE VIDEOS
  const videos = Array.from(
    new Map(
      (data?.getVideoContentWithPagination?.data || []).map(v => [v._id, v])
    ).values()
  );

  return (
    <View>
      {videos.map((video) => (
        <View key={video._id}>
          <TouchableOpacity
            style={[styles.lessonRow, activeVideoId === video._id && styles.activeLessonRow]}
            onPress={() => onSelectVideo(video)}
          >
            <MaterialCommunityIcons name="play-circle-outline" size={20} color="#888" />

            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>
                Lesson {video.video_content_order}. {video.video_content_name}
              </Text>
              <Text style={styles.lessonDuration}>Video</Text>
            </View>

            {video.resources?.length > 0 && (
              <MaterialCommunityIcons name="file-download-outline" size={18} color="#3F51B5" />
            )}
          </TouchableOpacity>

          {/* LIST ALL RESOURCES */}
          {video.resources?.length > 0 &&
            video.resources.map((res, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => Linking.openURL(FILE_BASE_URL + res)}
                style={{ paddingLeft: 40, paddingVertical: 4 }}
              >
                <Text style={{ color: "#3F51B5", fontSize: 12 }}>{res}</Text>
              </TouchableOpacity>
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  lessonRow: { flexDirection: "row", padding: 16, borderTopWidth: 1, borderTopColor: "#F8F9FA", alignItems: "center" },
  activeLessonRow: { backgroundColor: "#F0F3FF" },
  lessonInfo: { flex: 1, marginLeft: 12 },
  lessonTitle: { fontSize: 14, color: "#636E72", fontWeight: "500" },
  lessonDuration: { fontSize: 11, color: "#B2BEC3", marginTop: 2 },
});
