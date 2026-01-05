import { useState } from "react";
import { StyleSheet, View } from "react-native";
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

          <CourseList
            selectedCategoryId={selectedCategoryId}
            searchText={searchText}
            language={language}
          />
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
  scrollContent: { paddingHorizontal: 12, paddingBottom: 80, paddingTop: 12 },
});
