import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { UploadImage } from "../../../Fuction/UploadImage";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
};

export default function UploadImageProfile({ setFileUpload }) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera and storage access needed.");
      return;
    }

    Alert.alert("Choose an option", "Select or capture an image", [
      {
        text: "Take Picture",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
          });
          if (!result.canceled) handleImage(result.assets[0].uri);
        },
      },
      {
        text: "Select from Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            quality: 1,
          });
          if (!result.canceled) handleImage(result.assets[0].uri);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleImage = async (uri) => {
    // Add local URI to state for preview
    setFileUpload((prev) => [...prev, uri]);

    const newName = `image_${Date.now()}`;

    try {
      // Upload the image (HEIC → JPEG conversion done inside UploadImage)
      const uploadedImageURL = await UploadImage(uri, newName);

      if (uploadedImageURL) {
        // Add uploaded URL to state
        setFileUpload((prev) => [...prev, uploadedImageURL]);
      } else {
        console.error("Upload failed or returned empty URL");
      }
    } catch (e) {
      console.error("Image upload error:", e);
    }
  };

  return (
    <TouchableOpacity style={styles.camera} onPress={pickImage}>
      <MaterialIcons name="photo-camera" size={20} color={COLORS.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  camera: {
    position: "absolute",
    bottom: -10,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
});
