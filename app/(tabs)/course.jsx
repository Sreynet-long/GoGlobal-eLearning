import {View, Text, StyleSheet,ScrollView} from "react-native";
import Topbar from "../../components/headers/Topbar";
import Search from "../../components/courses/Search";
import FeatureCategory from "../../components/courses/FeatureCategory";

export default function course() {
  return (
    <View style={styles.screenContainer}>
      <Topbar/>
      <View style={styles.contentContainer}>
      <Search/>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FeatureCategory/>
      </ScrollView>
      </View>
    </View>
  )
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
    paddingHorizontal: 16,
    paddingBottom: 80,
  }
});