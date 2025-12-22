import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const { width } = Dimensions.get("window");

const StatItem = ({ label, value, icon, color }) => (
  <View style={styles.statBox}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    </View>
  </View>
);

export default function StatesRow() {
  const { language } = useLanguage();

  const stats = [
    { labelKey: "14_day_streak", value: "14", icon: "flame", color: "#f97316" },
    { labelKey: "badges_earned", value: "3", icon: "medal", color: "#eab308" },
    {
      labelKey: "hours_this_month",
      value: "20h",
      icon: "time",
      color: "#06b6d4",
    },
    {
      labelKey: "cert_ready",
      value: "85%",
      icon: "checkmark-circle",
      color: "#22c55e",
    },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.mainContainer}>
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            label={t(stat.labelKey, language)}
            value={stat.value}
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
    paddingHorizontal: 0,
    marginVertical: 10,
  },
  mainContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  textContainer: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 17,
    fontWeight: "900",
    color: "#1e293b", 
  },
  statLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: "#64748b",
    textAlign: "center",
    marginTop: 2,
    letterSpacing: 0.5,
  },
});