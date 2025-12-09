import {View, Text, StyleSheet,ScrollView} from "react-native";
import Topbar from "../../components/headers/Topbar";
import Search from "../../components/courses/Search";
import FeatureCategory from "../../components/courses/FeatureCategory";

export default function course() {
  return (
    <View style={styles.screenContainer}>
      <Topbar/>
      <Search/>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FeatureCategory/>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  }
});