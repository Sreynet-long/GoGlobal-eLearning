import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { FILE_BASE_URL } from "../../config/env";
import { useRef, useEffect } from "react";

export default function VideoPlayer({ video }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.stopAsync().then(() => {
        videoRef.current.playAsync();
      });
    }
  }, [video]);
  if (!video) return null;

  return (
    <View style={styles.container}>
      <View style={styles.videoWrapper}>
        <Video
          key={video._id}
          ref={videoRef}
          source={{ uri: FILE_BASE_URL + video.video_src }}
          useNativeControls
          resizeMode="contain"
          style={styles.video}
          shouldPlay
          onError={(err) => console.log("Video error:", err)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
    borderRadius: 12,
    marginBottom: 16,
  },
  videoWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
