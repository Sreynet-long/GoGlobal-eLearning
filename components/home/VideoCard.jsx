import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VideoCard() {
  return (
    <View>
      <TouchableOpacity style={styles.continueCard}>
        <Ionicons name="play-circle-outline" size={24} color="#1B5E20" />
        <Text style={styles.continueText}>
          CONTINUE LEARNING: AWS Architect
        </Text>
        <Ionicons name="rocket-outline" size={24} color="#FF6347" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  continueCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#D1E8D5",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  continueText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B5E20",
  },
});
