import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import Topbar from "../../components/headers/Topbar";
import HeroBanner from "../../components/home/HeroBanner";
import Ionicons from "@expo/vector-icons/Ionicons";

const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 44 : (StatusBar.currentHeight || 20);
const VERTICAL_PADDING = 12 + 12; 
const TOPBAR_TOTAL_HEIGHT = STATUS_BAR_HEIGHT + VERTICAL_PADDING;

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

const CourseCard = ({ title }) => (
  <View style={styles.courseCard}>
    <Text style={styles.courseCardTitle}>{title}</Text>
  </View>
);
// ----------------------------------------

export default function Index() {
  return (
    <View style={styles.screenContainer}>
      {/* 1. TOP BAR (Header) */}
      <Topbar />
       {/* 2. MAIN SCROLLABLE DASHBOARD CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* A. Hero Banner  */}
        <HeroBanner />
        {/* B. STATS ROW  */}
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
        {/* C. CONTINUE LEARNING CARD  */}
        <TouchableOpacity style={styles.continueCard}>
          <Ionicons name="play-circle-outline" size={24} color="#1B5E20" />
          <Text style={styles.continueText}>
            CONTINUE LEARNING: AWS Architect
          </Text>
          <Ionicons name="rocket-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
        {/* D. UTILITY MODULES GRID  */}
        {/* <View style={styles.moduleGrid}>
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
        </View> */}
        {/* E. FEATURED/TRENDING COURSES*/}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleText}>Trending Certifications</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalCourseScroll}
        >
          <CourseCard title="Python for Data Science" />
          <CourseCard title="CompTIA Security+" />
          <CourseCard title="React Native Mobile" />
          <CourseCard title="DevOps with Docker" />
        </ScrollView>
        {/* F. FREE COURSES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleText}>Start Learning for Free</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalCourseScroll}
        >
          <CourseCard title="FREE: Introduction to HTML" />
          <CourseCard title="FREE: C++ Variables & Types" />
          <CourseCard title="FREE: Excel 101" />
          <CourseCard title="FREE: JavaScript Fundamentals" />
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    paddingTop: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "#3F51B5",
    fontWeight: "500",
  },

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

  // --- MODULE GRID STYLES ---
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

  // --- HORIZONTAL COURSE SCROLL STYLES ---
  horizontalCourseScroll: {
    paddingBottom: 10,
  },
  courseCard: {
    width: 180,
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginRight: 10,
    padding: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  courseCardTitle: {
    fontWeight: "600",
    fontSize: 14,
  },
});
