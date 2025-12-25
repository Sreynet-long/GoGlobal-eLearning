import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { FILE_BASE_URL } from "../../config/env";

export default function VideoPlayer({ video }) {
  if (!video) return null;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: FILE_BASE_URL + video.video_src }}
        useNativeControls
        resizeMode="contain"
        style={styles.video}
        shouldPlay={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", height: 220, backgroundColor: "#000", borderRadius: 12, marginBottom: 16 },
  video: { width: "100%", height: "100%", borderRadius: 12 },
});
