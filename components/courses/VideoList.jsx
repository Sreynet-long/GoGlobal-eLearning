import { useMutation, useQuery } from "@apollo/client/react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FILE_BASE_URL } from "../../config/env";
import {
  GET_VIDEO_CONTENT_WITH_PAGINATION,
  VIDEO_PROCESS_STATUS,
} from "../../schema/course";
import DownloadButton from "./DownloadButton";

export default function VideoList({
  sectionId,
  onSelectVideo,
  activeVideoId,
  completedVideo,
  onToggleComplete,
  enrolledId,
}) {
  const { data, loading, error } = useQuery(GET_VIDEO_CONTENT_WITH_PAGINATION, {
    variables: {
      contentSectionId: sectionId,
      page: 1,
      limit: 50,
      pagination: false,
      keyword: "",
    },
    skip: !sectionId,
    fetchPolicy: "cache-and-network",
  });

  const [localCompleted, setLocalCompleted] = useState([]);
  const [videoProcessStatus] = useMutation(VIDEO_PROCESS_STATUS);

  // initialize localCompleted from prop or backend
  useEffect(() => {
    if (completedVideo) {
      setLocalCompleted(completedVideo);
    }
  }, [completedVideo]);

  const toggleCompleted = async (videoId) => {
    const isCompleted = localCompleted.includes(videoId);

    // Optimistic UI update
    setLocalCompleted((prev) =>
      isCompleted ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );

    // Call parent if needed
    onToggleComplete && onToggleComplete(videoId, !isCompleted);

    try {
      await videoProcessStatus({
        variables: {
          enrolledId,
          videoId,
          completed: !isCompleted,
        },
      });
    } catch (err) {
      console.error("Failed to update completion", err);
      // revert UI if mutation fails
      setLocalCompleted((prev) =>
        isCompleted ? [...prev, videoId] : prev.filter((id) => id !== videoId)
      );
    }
  };

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
      {videos.map((video) => {
        const isCompleted = localCompleted.includes(video._id);
        return (
          <View key={video._id}>
            <TouchableOpacity
              style={[
                styles.lessonRow,
                activeVideoId === video._id && styles.activeLessonRow,
              ]}
              onPress={() => onSelectVideo(video)}
            >
              {/* Tap this icon to toggle completion */}
              <TouchableOpacity onPress={() => toggleCompleted(video._id)}>
                <MaterialCommunityIcons
                  name={
                    isCompleted
                      ? "check-circle"
                      : "play-circle-outline"
                  }
                  size={24}
                  color={isCompleted ? "#4CAF50" : "#393a3aff"}
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>

              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>
                  Lesson {video.video_content_order}. {video.video_content_name}
                </Text>
                <Text style={styles.lessonDuration}>
                  Video
                </Text>
              </View>
            </TouchableOpacity>

            {video.resources?.length > 0 &&
              video.resources.map((res, i) => {
                const filename = res.split("/").pop().split("__")[0] + ".pdf";
                const fileUrl = FILE_BASE_URL + res;
                return (
                  <View key={i} style={styles.lessonPdfRow}>
                    <DownloadButton fileUrl={fileUrl} filename={filename} />
                    <TouchableOpacity
                      onPress={() => Linking.openURL(fileUrl)}
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
        );
      })}
    </View>
  );
}

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
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 15, color: "#393a3aff", fontWeight: "600" },
  lessonDuration: { fontSize: 11, color: "#393a3aff", marginTop: 2 },
});
