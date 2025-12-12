import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";

const CourseCard = ({ title, image }) => (
  <ImageBackground source={image} style={styles.courseCard} imageStyle={{borderRadius: 10}}>
    <Text style={styles.courseCardTitle}>{title}</Text>
  </ImageBackground>
);
export default function TrendingCourse() {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitleText}>Trending Courses</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalCourseScroll}
      >
        <CourseCard
          title="Python for Data Science"
          image={require("../../assets/courses/python.png")}
        />
        <CourseCard
          title="CompTIA Security+"
          image={require("../../assets/courses/security.png")}
        />
        <CourseCard
          title="React Native Mobile"
          image={require("../../assets/courses/react-native.png")}
        />
        <CourseCard
          title="DevOps with Docker"
          image={require("../../assets/courses/security.png")}
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
    fontWeight: "bold"
  },
});
