import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import EnrolledCourses from "../../components/courses/EnrolledCourses";
import FeatureCategory from "../../components/courses/FeatureCategory";
import Search from "../../components/courses/Search";
import Topbar from "../../components/headers/Topbar";
import { useLanguage } from "../../context/LanguageContext";

export default function MyCourseScreen() {
  const { language } = useLanguage();
   const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");

  return (
    <View style={styles.screenContainer}>
      <Topbar />

      <View style={styles.contentContainer}>
        <Search
          value={searchText}
          onChange={setSearchText}
          placeholder={
            language === "en" ? "Search courses" : "ស្វែងរកវគ្គសិក្សា"
          }
        />

        {/* <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
          <FeatureCategory
            onSelectedCategory={setSelectedCategoryId}
            language={language}
          />
        </View> */}
          <EnrolledCourses
            searchText={searchText}
            language={language}
          />
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#25375A" },
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
