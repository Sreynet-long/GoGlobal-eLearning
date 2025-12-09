import { View, Text ,StyleSheet} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'


const StatCircle = ({ label, value, icon, color }) => (
  <View style={styles.statCircle}>
    <Ionicons name={icon} size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);
export default function StatesRow() {
  return (
    <View>
      <View style={styles.statsRow}>
          <StatCircle
            label="14-Day Streak"
            value="14"
            icon="flame"
            color="#E65100"
          />
          <StatCircle
            label="Badges Earned"
            value="3"
            icon="medal"
            color="#FFC107"
          />
          <StatCircle
            label="Hours This Month"
            value="20"
            icon="time"
            color="#00BCD4"
          />
          <StatCircle
            label="Cert Ready"
            value="85%"
            icon="checkmark-circle"
            color="#4CAF50"
          />
        </View>
    </View>
  )
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