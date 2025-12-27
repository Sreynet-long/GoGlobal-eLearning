import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { IMAGE_BASE_URL } from "../../../config/env";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  background: "#F1F5F9",
  white: "#FFFFFF",
  error: "#F43F5E",
  textDark: "#0F172A",
  grey600: "#475569",
  grey200: "#E2E8F0",
};

export default function UploadImage({setFileUpload}){

  const createFormData = (files) => {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append("files", {
        uri: file.uri,
        name: file.fileName || `file_${index}.jpg`,
        type: file.mimeType || "image/jpeg",
      });
    });

    return formData;
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      // allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets;
    }
    return [];
  };

  const uploadFiles = async () => {
    try {
      const files = await pickImage();
      if (!files.length) return;

      const formData = createFormData(files);

      const response = await fetch(`${IMAGE_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      setFileUpload(result?.files, "result?.files");
      // await AsyncStorage.setItem("uploadLocalFiles", result?.files);

      console.log("Upload result:", result);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
      <TouchableOpacity style={styles.camera} onPress={uploadFiles}>
        <MaterialIcons name="photo-camera" size={20} color={COLORS.white} />
      </TouchableOpacity>
      // <TouchableOpacity onPress={uploadFiles}>
      //   <MaterialIcons name="photo-camera" size={20} color={"#FFFFFF"}/>
      // </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  camera: {
    position: "absolute",
    bottom: -10,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
});