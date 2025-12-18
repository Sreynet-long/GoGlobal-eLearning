import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const CourseCard = ({ title, image }) => (
  <ImageBackground
    source={image}
    style={styles.courseCard}
    imageStyle={{ borderRadius: 10 }}
  >
    <Text style={styles.courseCardTitle}>{title}</Text>
  </ImageBackground>
);

export default function FreeCourse() {
  const { language } = useLanguage();
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitleText}>
          {t("start_learning_for_free", language)}
        </Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>{t("view_all", language)}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalCourseScroll}
      >
        <CourseCard
          title={t("introduction_to_html", language)}
          image={require("../../assets/courses/html.png")}
        />
        <CourseCard
          title={t("C_variables_and_types", language)}
          image={require("../../assets/courses/cpp-var.png")}
        />
        <CourseCard
          title={t("excel_101", language)}
          image={require("../../assets/courses/excel.png")}
        />
        <CourseCard
          title={t("javascript_fundamentals", language)}
          image={require("../../assets/courses/js.jpg")}
        />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "#3F51B5",
    fontWeight: "500",
  },
  horizontalCourseScroll: {
    paddingBottom: 10,
  },
  courseCard: {
    width: 180,
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginRight: 10,
    padding: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  courseCardTitle: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 60,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.56)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
