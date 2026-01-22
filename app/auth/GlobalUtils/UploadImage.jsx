import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { FILE_BASE_URL } from "../../../config/env";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
};

export default function UploadImage({ setFileUpload }) {
  const createFormData = (files) => {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append("files", {
        uri: file.uri,
        name: file.fileName || `image_${index}.jpg`,
        type: file.type || "image/jpeg",
      });
    });

    return formData;
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert("Permission required", "Please allow photo access");
        return [];
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) return result.assets;
      return [];
    } catch (err) {
      console.log("Pick image error:", err);
      return [];
    }
  };

  const uploadFiles = async () => {
    try {
      const files = await pickImage();
      if (!files.length) return;

      const formData = createFormData(files);

      const response = await fetch(`${FILE_BASE_URL}/upload`, {
        method: "POST",
        body: formData, // ⚠️ do NOT set headers
      });

      const result = await response.json();
      setFileUpload(result?.files || []);
    } catch (err) {
      console.log("Upload error:", err);
      Alert.alert("Upload failed", "Please try again");
    }
  };

  return (
    <TouchableOpacity style={styles.camera} onPress={uploadFiles}>
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
