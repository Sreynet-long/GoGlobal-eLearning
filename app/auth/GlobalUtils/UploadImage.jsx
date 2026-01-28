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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    // if (result.canceled) return [];
    if (!result.canceled) {
      try {
        Alert.alert("Success", "Image uploaded successfully!");
        return result.assets[0];
      } catch (error) {
        Alert.alert("Error", "Image upload failed.");
        console.error(error);
      }
    }

    // ✅ Always return array
    // return result.assets ?? [];
    return null;
  };



  return (
    <TouchableOpacity style={styles.camera} >
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
