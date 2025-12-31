import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import CourseList from "../../components/courses/CourseList";
import FeatureCategory from "../../components/courses/FeatureCategory";
import Search from "../../components/courses/Search";
import Topbar from "../../components/headers/Topbar";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";



export default function Courses() {
  
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
          placeholder={t("search_courses", language)}
        />

        <View style={{ paddingHorizontal: 16 }}>
          <FeatureCategory onSelectedCategory={setSelectedCategoryId} />
        </View>

        {/* <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        > */}
          <CourseList
            selectedCategoryId={selectedCategoryId}
            searchText={searchText}
            language={language}
          />
        {/* </ScrollView> */}
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
    paddingBottom: 30,
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 80, paddingTop: 12 },
});
