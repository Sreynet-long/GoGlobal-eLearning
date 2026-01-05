import { Video } from "expo-av";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { FILE_BASE_URL, IMAGE_BASE_URL } from "../../config/env";
import * as ScreenOrientation from "expo-screen-orientation";

export default function VideoPlayer({ video, onComplete }) {
  const videoRef = useRef(null);
  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.stopAsync().then(() => {
  //       videoRef.current.playAsync();
  //     });
  //   }
  // }, [video]);
  // if (!video) return null;

    useEffect(() => {
    return () => {
      // Always restore portrait when unmounting
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    };
  }, []);

  if (!video) return null;

  const handleFullscreenUpdate = async ({ fullscreenUpdate }) => {
    if (fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    }

    if (fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    }
  };

    
    if (selectedVideo) {
      return (
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={{ uri: FILE_BASE_URL + selectedVideo.video_src }}
            style={styles.videoWrapper}
            useNativeControls
            resizeMode="contain"
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
    transform: [{ rotate: "90deg" }],
  },
});
