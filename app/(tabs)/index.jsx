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
import FreeCourse from "../../components/home/FreeCourse";
import TrendingCourse from "../../components/home/TrendingCourse";
import UtilityModules from "../../components/home/UtilityModules";
import StatesRow from "../../components/home/StatesRow";
import VideoCard from "../../components/home/VideoCard";

export default function Index() {
  return (
    <View style={styles.screenContainer}>
      <Topbar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HeroBanner />
        <StatesRow/>
        <VideoCard/>
        {/* <UtilityModules/> */}
        <TrendingCourse/>
        <FreeCourse/>
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
});
