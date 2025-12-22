import { ScrollView, StyleSheet, View } from "react-native";
import Topbar from "../../components/headers/Topbar";
import FreeCourse from "../../components/home/FreeCourse";
import HeroBanner from "../../components/home/HeroBanner";
import StatesRow from "../../components/home/StatesRow";
import TrendingCourse from "../../components/home/TrendingCourse";
import VideoCard from "../../components/home/VideoCard";

export default function Index() {
  return (
    <View style={styles.screenContainer}>
      <Topbar />
      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HeroBanner />
          <StatesRow />
          <VideoCard />
          <TrendingCourse />
          <FreeCourse />
        </ScrollView>
      </View>
    </View>
  );
}
//==================== Styles ====================
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#25375aff" },
  contentContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
    paddingBottom:30
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 80, paddingTop: 12 },
});
