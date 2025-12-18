import { useQuery } from "@apollo/client/react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IMAGE_BASE_URL } from "../../config/env.js";
import { useLanguage } from "../../context/LanguageContext"; // <-- Import useLanguage
import { t } from "../../lang";
import { GET_COURSE_WITH_PAGINATION } from "../../schema/course";

export default function CourseList({ selectedCategoryId, searchText }) {
  const { language } = useLanguage(); // <-- Add this

  const { data, loading, error } = useQuery(GET_COURSE_WITH_PAGINATION, {
    variables: {
      page: 1,
      limit: 50,
      pagination: false,
      keyword: searchText || "",
      categoryId: selectedCategoryId === "All" ? "All" : selectedCategoryId,
    },
  });

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color="#58589bff"
          alignItems="center"
          marginTop={20}
        />
      </View>
    );

  if (error)
    return (
      <Text style={styles.textHeader}>
        {t("error_loading", language)}: {error.message}
      </Text>
    );

  const Courses = data?.getCourseWithPagination?.data || [];

  const filteredCourses =
    selectedCategoryId === "All"
      ? Courses
      : Courses.filter((item) => item.category_id?._id === selectedCategoryId);

  return (
    <View>
      <Text style={styles.textHeader}>{t("courses_list", language)}</Text>
      {filteredCourses.length === 0 ? (
        <View>
          <Image
            source={require("../../assets/images/find-course.png")}
            style={styles.emptyImage}
          />
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            {t("no_courses_found", language)}
          </Text>
        </View>
      ) : (
        filteredCourses.map((course) => (
          <TouchableOpacity style={styles.card} key={course._id}>
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${course.thumbnail}` }}
              style={styles.cardImage}
            />
            <View style={styles.cardBody}>
              <Text style={styles.textTitle}>{course.title}</Text>
              <View style={styles.row}>
                <View style={styles.priceBox}>
                  <Text style={styles.textPrice}>
                    ${course.original_price?.toFixed(2) ?? "0.00"}
                  </Text>
                  <Text style={styles.textSellPrice}>
                    ${course.sell_price?.toFixed(2) ?? "0.00"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.enrollButton}
                  onPress={() => console.log(`Enrolled in ${course.title}`)}
                >
                  <Text style={styles.textEnroll}>{t("enroll", language)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  textHeader: { fontSize: 18, fontWeight: "700", marginVertical: 10 },
  textTitle: { paddingVertical: 5, fontSize: 16 },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  cardImage: { width: "40%", height: 120, resizeMode: "cover" },
  cardBody: { flex: 1, padding: 10, justifyContent: "center" },
  textHours: { fontSize: 14, color: "#666" },
  textPrice: {
    fontSize: 13,
    color: "#8a8888ff",
    textDecorationLine: "line-through",
  },
  textRating: { fontSize: 14, color: "#8a8888ff" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  enrollButton: {
    backgroundColor: "#3F51B5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  textEnroll: { color: "white", fontWeight: "500" },
  emptyImage: { marginTop: 100, width: 60, height: 60, alignSelf: "center" },
  textSellPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#25375aff",
    marginTop: 2,
  },
  priceBox: { flexDirection: "column" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 140,
  },
});
