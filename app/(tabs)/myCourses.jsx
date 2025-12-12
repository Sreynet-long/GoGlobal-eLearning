import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import FeatureCategory from "../../components/courses/FeatureCategory";
import Search from "../../components/courses/Search";
import Topbar from "../../components/headers/Topbar";
import EnrolledCourses from "../../components/courses/EnrolledCourses";

export default function myCourses() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <View style={styles.screenContainer}>
      <Topbar />
      <View style={styles.contentContainer}>
        <Search />
        <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <FeatureCategory onSelectedCategory={setSelectedCategory} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <EnrolledCourses selectedCategory={selectedCategory} />
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
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});
