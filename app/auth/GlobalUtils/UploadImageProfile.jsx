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
    console.log("PICKIMAGE:", pickImage);
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
    console.log("handleImage:", handleImage)
    setFileUpload((prev) => [...prev, uri]);
    // const newName = `image_${Date.now()}`;
    const newName = `profile_${Date.now()}.jpg`;

    try {
      const formData = new FormData();
      console.log("FORMDATA:",formData);
      formData.append("file", {
        uri,
        name: newName + ".jpg",
        type: "image/jpeg",
      });
      const uploadedImageURL = await UploadImage(formData, newName);
      setFileUpload((prev) => [...prev, uploadedImageURL]);
      console.log("uploadImage", uploadedImageURL)
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
