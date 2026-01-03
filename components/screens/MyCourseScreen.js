import { useState } from "react";
import { StyleSheet, View } from "react-native";
import EnrolledCourses from "../../components/courses/EnrolledCourses";
import Search from "../../components/courses/Search";
import Topbar from "../../components/headers/Topbar";
import { useLanguage } from "../../context/LanguageContext";

export default function MyCourseScreen() {
  const { language } = useLanguage();
  const [searchText, setSearchText] = useState("");

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

        <EnrolledCourses searchText={searchText} />
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
