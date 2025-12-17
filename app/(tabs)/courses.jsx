import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import CourseList from "../../components/courses/CourseList";
import FeatureCategory from "../../components/courses/FeatureCategory";
import Search from "../../components/courses/Search";
import Topbar from "../../components/headers/Topbar";

export default function courses() {
  const [searchText, setSearchText] = useState("");
  console.log("searchText", searchText);
  const [selectedCategory, setSelectedCategory] = useState("All");
  return (
    <View style={styles.screenContainer}>
      <Topbar />
      <View style={styles.contentContainer}>
        <Search value={searchText} onChange={setSearchText} />
        <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
          <FeatureCategory onSelectedCategory={setSelectedCategory} />
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CourseList selectedCategory={selectedCategory} searchText={searchText} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#25375aff" },
  contentContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 80 },
});
