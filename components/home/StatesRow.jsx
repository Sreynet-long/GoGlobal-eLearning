import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const StatCircle = ({ label, value, icon, color }) => (
  <View style={styles.statCircle}>
    <Ionicons name={icon} size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function StatesRow() {
  const { language } = useLanguage();

  const stats = [
    { labelKey: "14_day_streak", value: "14", icon: "flame", color: "#E65100" },
    { labelKey: "badges_earned", value: "3", icon: "medal", color: "#FFC107" },
    {
      labelKey: "hours_this_month",
      value: "20",
      icon: "time",
      color: "#00BCD4",
    },
    {
      labelKey: "cert_ready",
      value: "85%",
      icon: "checkmark-circle",
      color: "#4CAF50",
    },
  ];

  return (
    <View>
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <StatCircle
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  statCircle: {
    alignItems: "center",
    width: "25%",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "gray",
    textAlign: "center",
  },
});
