import { Platform } from "react-native";

// Base URL for images
export const IMAGE_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:6800/files/"
    : "http://192.168.5.36:6800/files/";
