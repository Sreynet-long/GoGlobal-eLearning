import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const ModuleTile = ({ title, iconName, color }) => (
  <TouchableOpacity style={styles.moduleTile}>
    <Ionicons name={iconName} size={30} color={color} />
    <Text style={styles.moduleTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function UtilityModules() {
  const { language } = useLanguage();
  const modules = [
    { titleKey: "my_enrollments", iconName: "book-outline", color: "#3F51B5" },
    {
      titleKey: "cert_tracks",
      iconName: "clipboard-outline",
      color: "#FF5722",
    },
    { titleKey: "community", iconName: "people-outline", color: "#4CAF50" },
    {
      titleKey: "live_sessions",
      iconName: "calendar-outline",
      color: "#00BCD4",
    },
    { titleKey: "knowledge_base", iconName: "bulb-outline", color: "#FFC107" },
    {
      titleKey: "skill_quizzes",
      iconName: "bar-chart-outline",
      color: "#E91E63",
    },
  ];

  return (
    <View>
      <View style={styles.moduleGrid}>
        {modules.map((mod, index) => (
          <ModuleTile
            key={index}
            title={t(mod.titleKey, language)}
            iconName={mod.iconName}
            color={mod.color}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  moduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  moduleTile: {
    width: "30%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  moduleTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
    marginTop: 6,
  },
});
