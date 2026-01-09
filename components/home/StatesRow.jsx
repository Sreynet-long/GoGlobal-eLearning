import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const StatItem = ({ label, icon, color }) => (
  <View style={styles.statBox}>
    {/* Concentric Circle Design */}
    <View style={styles.iconOuterRing}>
      <View style={[styles.iconInnerCircle, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={25} color={color} />
      </View>
    </View>
    
    <View style={styles.textWrapper}>
      <Text style={styles.statLabel} numberOfLines={3}>
        {label}
      </Text>
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
  </View>
);

export default function StatesRow() {
  const { language } = useLanguage();

  const stats = [
    { label: t("easy_to_learn", language), icon: "book-outline", color: "#6366f1" },
    { label: t("modern_tech", language), icon: "rocket-outline", color: "#f97316" },
    { label: t("many_courses", language), icon: "layers-outline", color: "#22c55e" },
    { label: t("skills_built", language), icon: "construct-outline", color: "#0ea5e9" },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.glassContainer}>
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            label={(t(stat.label, language) || stat.label).toUpperCase()}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginVertical: 0,
  },
  glassContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 1)", 
    paddingVertical: 16,
    borderRadius: 24,
    // borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 1)",
    justifyContent: "space-around",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 10 },
    // shadowOpacity: 0.03,
    // shadowRadius: 20,
    // elevation: 1,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  iconOuterRing: {
    width: 54,
    height: 54,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  iconInnerCircle: {
    width: 46,
    height: 46,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#334155",
    textAlign: "center",
    letterSpacing: 0.8,
    lineHeight: 15,
    maxWidth: 60,
    
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginTop: 2,
  },
});