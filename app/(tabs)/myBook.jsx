import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Topbar from "../../components/headers/Topbar";

// --- Dashboard Component Placeholders ---

const StatCircle = ({ label, value, icon, color }) => (
  <View style={styles.statCircle}>
    <Ionicons name={icon} size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ModuleTile = ({ title, iconName, color }) => (
  <TouchableOpacity style={styles.moduleTile}>
    <Ionicons name={iconName} size={30} color={color} />
    <Text style={styles.moduleTitle}>{title}</Text>
  </TouchableOpacity>
);

// ----------------------------------------

export default function myBook() {
  return (
    // Use a standard View with flex: 1 since Topbar handles safe area padding
    <View style={styles.screenContainer}>
      {/* 1. TOP BAR */}
      <Topbar />
      <View style={styles.contentContainer}>
        {/* 2. MAIN SCROLLABLE DASHBOARD CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* A. STATS ROW (The blue circles) */}
          <View style={styles.statsRow}>
            <StatCircle
              label="14-Day Streak"
              value="14"
              icon="flame"
              color="#E65100"
            />
            <StatCircle
              label="3 Badges Earned"
              value="3"
              icon="medal"
              color="#FFC107"
            />
            <StatCircle
              label="20 Hours This Month"
              value="20"
              icon="time"
              color="#00BCD4"
            />
            <StatCircle
              label="85% Cert Ready"
              value="85%"
              icon="checkmark-circle"
              color="#4CAF50"
            />
          </View>

          {/* B. CONTINUE LEARNING CARD (Primary Action) */}
          <TouchableOpacity style={styles.continueCard}>
            <Ionicons name="play-circle-outline" size={24} color="#000" />
            <Text style={styles.continueText}>
              CONTINUE LEARNING: HTML & CSS
            </Text>
            <Ionicons name="rocket-outline" size={24} color="#FF6347" />
          </TouchableOpacity>

          {/* C. UTILITY MODULES GRID */}
          <View style={styles.moduleGrid}>
            <ModuleTile
              title="MY ENROLLMENTS"
              iconName="book-outline"
              color="#3F51B5"
            />
            <ModuleTile
              title="CERT TRACKS"
              iconName="clipboard-outline"
              color="#FF5722"
            />
            <ModuleTile
              title="COMMUNITY"
              iconName="people-outline"
              color="#4CAF50"
            />
            <ModuleTile
              title="LIVE SESSIONS"
              iconName="calendar-outline"
              color="#00BCD4"
            />
            <ModuleTile
              title="KNOWLEDGE BASE"
              iconName="bulb-outline"
              color="#FFC107"
            />
            <ModuleTile
              title="SKILL QUIZZES"
              iconName="bar-chart-outline"
              color="#E91E63"
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#25375aff",
  },
  contentContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },

  // --- STATS ROW STYLES ---
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

  // --- CONTINUE LEARNING STYLES ---
  continueCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#D1E8D5",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  continueText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B5E20",
  },

  // --- MODULE GRID STYLES ---
  moduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  moduleTile: {
    width: "30%", // Allows 3 tiles per row with spacing
    aspectRatio: 1, // Makes the tile square
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
