import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DownloadButton({ filename, fileUrl }) {
const [localUri, setLocalUri ] = useState(null);
  const handleDownload = async () => {
    try {
      const uri = FileSystem.documentDirectory + filename;

      const result = await FileSystem.downloadAsync(fileUrl, uri);
    setLocalUri(result.uri);
      Alert.alert("Download Now !", `Saved to: ${result.uri}`);

      // Optionally open/share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri);
      }
    } catch (error) {
      console.log("Download error:", error);
      Alert.alert("Error", "Failed to download file!");
    }
  };

  const handleView = () => {
    if (localUri) {
      Linking.openURL(localUri);
    } else {
      Alert.alert("File not downloaded", "Please download the file first.");
    }
  };
  return (
    <View style={styles.wrapper}>
      {/* Button download */}
      <TouchableOpacity style={styles.button} onPress={handleDownload}>
        <Text style={styles.text}>{filename}</Text>
        <MaterialCommunityIcons
          name="file-download-outline"
          size={18}
          color="#3F51B5"
        />
      </TouchableOpacity>

      {/* Button View */}
      {/* <TouchableOpacity style={styles.viewButton} onPress={handleView}>
        <MaterialCommunityIcons
          name="file-eye-outline"
          size={18}
          color="#3F51B5"
        />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    // paddingVertical: 8,
    // paddingHorizontal: 5,
    borderRadius: 6,
    marginVertical: 4,
    marginLeft: 2,
  },
  text: {
    fontSize: 1,
    fontWeight: "2",
    color: "transparent",
    // marginRight: 2,
  },
  viewButton: {
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    // paddingHorizontal: 10,
    borderRadius: 6,
    borderColor: "#3F51B5",
  },
  viewText: {
    color: "#3F51B5",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
});
