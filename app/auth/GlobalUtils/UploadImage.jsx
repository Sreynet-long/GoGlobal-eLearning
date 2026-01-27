import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { FILE_BASE_URL } from "../../../config/env";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
};

export default function UploadImage({ setFileUpload }) {
  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow photo access");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaType.Image,
      mediaTypes: ["images"],
      quality: 1,
    });

    if (result.canceled) return [];

    // ✅ Always return array
    return result.assets ?? [];
  };

   const uploadFiles = async () => {
      try {
        const files = await pickImages();
        if (!files.length) return;
  
        const formData = new FormData();
       
        files?.forEach((file, index) => {
          formData?.append("files", {
            uri: file.uri,
            name: file.fileName || `profile_${Date.now()}_${index}.jpg`,
            type: file.mimeType || "image/jpeg",
          });
        });
  

      } catch (err) {
        console.log("Upload error:", err.message);
        Alert.alert("Upload failed");
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
