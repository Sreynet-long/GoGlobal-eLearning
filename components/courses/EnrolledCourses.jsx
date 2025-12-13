import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Courses = [
  {
    id: "1",
    title: "HTML & CSS for Beginners",
    constructor: "Author 1",
    rating: 4.5,
    progress: 80,
    hours: 10,
    category: "Web Dev",
    image: require("../../assets/courses/html-css.png"),
  },
  {
    id: "2",
    title: "JavaScript Basics",
    constructor: "Author 1",
    rating: 4.5,
    progress: 40,
    hours: 12,
    category: "Web Dev",
    image: require("../../assets/courses/js.jpg"),
  },
  {
    id: "3",
    title: "Bootstrap Essentials",
    constructor: "Author 1",
    rating: 4.5,
    progress: 60,
    hours: 8,
    category: "Web Dev",
    image: require("../../assets/courses/html-css.png"),
  },
  {
    id: "4",
    title: "Adobe Photoshop",
    constructor: "Author 2",
    rating: 4.0,
    progress: 30,
    hours: 15,
    category: "Graphic Design",
    image: require("../../assets/courses/photoshop.png"),
  },
  {
    id: "5",
    title: "Adobe Illustrator",
    constructor: "Author 2",
    rating: 4.0,
    progress: 50,
    hours: 15,
    category: "Graphic Design",
    image: require("../../assets/courses/illustrator.png"),
  },
  {
    id: "6",
    title: " UX Design & Interaction (The `How`)",
    constructor: "Author 3",
    rating: 3.5,
    progress: 75,
    hours: 8,
    category: "UX UI",
    image: require("../../assets/courses/html-css.png"),
  },
  {
    id: "7",
    title: "Mathematical & Statistical Foundations",
    constructor: "Author 4",
    rating: 5.0,
    progress: 20,
    hours: 20,
    category: "Data Science",
    image: require("../../assets/courses/mathematic.png"),
  },
];

export default function EnrolledCourses({ selectedCategory }) {
  const filteredCourses =
    selectedCategory === "All"
      ? Courses
      : Courses.filter((item) => item.category === selectedCategory);
  return (
    <View>
      <Text style={styles.textHeader}>Courses Enrolled List</Text>
      {filteredCourses.length === 0 ? (
        <View>
          <Text style={{textAlign: "center" , marginTop: 20}}>No courses enrolled in this category.</Text>
        </View>
      ) : (

      filteredCourses.map((course) => (
        <TouchableOpacity style={styles.card} key={course.id}>
          <Image source={course.image} style={styles.cardImage} />
          <View style={styles.cardBody}>
            <Text style={styles.textTitle}>{course.title}</Text>
            <Text style={styles.textHours}>{course.hours} hours</Text>
            <View style={styles.row}>
              <View style={styles.progressBarContainer}>
                <Text
                  style={[styles.progressBar, { width: `${course.progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{course.progress}% Completed</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 10,
  },
  textTitle: {
    paddingVertical: 5,
    fontSize: 16,
  },
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
  cardImage: {
    width: "40%",
    height: 120,
    resizeMode: "cover",
  },
  cardBody: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  textHours: {
    fontSize: 14,
    color: "#666",
  },
  textPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#25375aff",
  },
  textRating: {
    fontSize: 14,
    color: "#8a8888ff",
     
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  progressBarContainer: {
    flex: 1,
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginRight: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#25375aff",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
});
