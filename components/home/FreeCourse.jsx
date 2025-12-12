import { Text, View, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from "react-native";


const CourseCard = ({ title , image}) => (
  <ImageBackground  source={image} style={styles.courseCard} imageStyle={{borderRadius: 10}}>
    <Text style={styles.courseCardTitle}>{title}</Text>
  </ImageBackground>
);
export default function FreeCourse() {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitleText}>Start Learning for Free</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalCourseScroll}
      >
        <CourseCard title="Introduction to HTML" image={require("../../assets/courses/html.png")} />
        <CourseCard title="C++ Variables & Types" image={require("../../assets/courses/cpp-var.png")}/>
        <CourseCard title="Excel 101" image={require("../../assets/courses/excel.png")} />
        <CourseCard title="JavaScript Fundamentals" image={require("../../assets/courses/js.jpg")} />
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
})
