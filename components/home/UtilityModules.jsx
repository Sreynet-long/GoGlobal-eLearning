import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const ModuleTile = ({ title, iconName, color }) => (
  <TouchableOpacity activeOpacity={0.6} style={styles.moduleTile}>
    <View style={[styles.iconCircle, { backgroundColor: `${color}10` }]}>
      <Ionicons name={iconName} size={24} color={color} />
    </View>
    <Text style={styles.moduleTitle} numberOfLines={2}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function UtilityModules() {
  const { language } = useLanguage();
  
  const modules = [
    { titleKey: "my_enrollments", iconName: "book", color: "#6366f1" },
    { titleKey: "cert_tracks", iconName: "ribbon", color: "#f59e0b" },
    { titleKey: "community", iconName: "chatbubbles", color: "#10b981" },
    { titleKey: "live_sessions", iconName: "videocam", color: "#ef4444" },
    { titleKey: "knowledge_base", iconName: "library", color: "#8b5cf6" },
    { titleKey: "skill_quizzes", iconName: "extension-puzzle", color: "#06b6d4" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.moduleGrid}>
        {modules.map((mod, index) => (
          <ModuleTile
  key={index}
  title={String(t(mod.titleKey, language) ?? "")}
  iconName={mod.iconName}
  color={mod.color}
/>

        ))}
      </View>
    </View>
  );
}

//==================== Styles ====================


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 25,
  },
  moduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  moduleTile: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569", 
    textAlign: "center",
    lineHeight: 14,
    paddingHorizontal: 4,
  },
});