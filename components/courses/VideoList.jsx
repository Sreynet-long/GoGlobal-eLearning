import { useQuery } from "@apollo/client/react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FILE_BASE_URL } from "../../config/env";
import { GET_VIDEO_CONTENT_WITH_PAGINATION } from "../../schema/course";
import DownloadButton from "./DownloadButton";

export default function VideoList({ sectionId, onSelectVideo, activeVideoId, completedVideo }) {
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

  if (loading)
    return (
      <ActivityIndicator
        style={{ margin: 12, color: "rgba(79, 120, 255, 1)" }}
      />
    );
  if (error)
    return (
      <Text style={{ color: "red", padding: 12 }}>Failed to load videos</Text>
    );

  // REMOVE DUPLICATE VIDEOS
  const videos = Array.from(
    new Map(
      (data?.getVideoContentWithPagination?.data || []).map((v) => [
        `${v.video_content_order}-${v.video_content_name}`,
        v,
      ])
    ).values()
  );

  return (
    <View>
      {videos.map((video) => (
        <View key={video._id}>
          <TouchableOpacity
            style={[
              styles.lessonRow,
              activeVideoId === video._id && styles.activeLessonRow,
            ]}
            onPress={() => onSelectVideo(video)}
          >
            <MaterialCommunityIcons
              name={completedVideo?.includes(video._id) ? "check-circle" : "play-circle-outline"}
              size={20}
              color={completedVideo?.includes(video._id) ? "#4CAF50" : "#888"}
            />

            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>
                Lesson {video.video_content_order}. {video.video_content_name}
              </Text>
              <Text style={styles.lessonDuration}>Video</Text>
            </View>

            {/* {video.resources?.length > 0 && (
              <MaterialCommunityIcons
                name="file-download-outline"
                size={18}
                color="#3F51B5"
              />
            )} */}
          </TouchableOpacity>

          {/* LIST ALL RESOURCES */}
          {video.resources?.length > 0 &&
            video.resources.map((res, i) => {
              const filename = res.split("/").pop().split("__")[0] + ".pdf";
              const fileUrl = FILE_BASE_URL + res;
              return (
                <View key={i} style={styles.lessonPdfRow}>
                  <DownloadButton
                    // style={{ marginRight: 10}}
                    fileUrl={fileUrl}
                    filename={filename}
                  />
                  <TouchableOpacity
                    key={i}
                    onPress={() => Linking.openURL(FILE_BASE_URL + res)}
                    style={{
                      paddingLeft: 10,
                      paddingVertical: 4,
                      marginRight: 1,
                    }}
                  >
                    <Text style={{ color: "#3F51B5", fontSize: 14 }}>
                      {filename}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>
      ))}
    </View>
  );
}
//  Linking.openURL(FILE_BASE_URL + res)
const styles = StyleSheet.create({
  lessonRow: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F8F9FA",
    alignItems: "center",
  },
  lessonPdfRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8F9FA",
    alignItems: "center",
  },
  activeLessonRow: { backgroundColor: "#bbc9ffff" },
  lessonInfo: { flex: 1, marginLeft: 12 },
  lessonTitle: { fontSize: 15, color: "#636E72", fontWeight: "600" },
  lessonDuration: { fontSize: 11, color: "#505050ff", marginTop: 2 },
});
