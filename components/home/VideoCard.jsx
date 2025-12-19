import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

export default function VideoCard() {
  const { language } = useLanguage();
  return (
    <View>
      <TouchableOpacity style={styles.continueCard}>
        <Ionicons name="play-circle-outline" size={24} color="#1B5E20" />
        <Text style={styles.continueText}>
          {t("CONTINUE_LEARNING_AWS_Architect", language)}
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
