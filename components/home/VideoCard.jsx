import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

export default function VideoCard() {
  const { language } = useLanguage();
  
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity activeOpacity={0.8} style={styles.continueCard}>
        <View style={styles.leftSection}>
          <View style={styles.playIconContainer}>
            <Ionicons name="play" size={16} color="#ffffff" />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.label}>{t("RESUME_LEARNING", language)}</Text>
            <Text style={styles.courseTitle} numberOfLines={1}>
              {t("CONTINUE_LEARNING_AWS_Architect", language)}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
           <View style={styles.badge}>
              <Text style={styles.badgeText}>65%</Text>
           </View>
           <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

//==================== Styles ====================

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  continueCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#22c55e", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0fdf4", 
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  playIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#22c55e", 
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: "800",
    color: "#22c55e",
    letterSpacing: 1,
    marginBottom: 2,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b", 
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16a34a",
  },
});