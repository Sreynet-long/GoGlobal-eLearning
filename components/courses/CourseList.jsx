import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Courses = [
  {
    id: "1",
    title: "HTML & CSS for Beginners",
    constructor: "Author 1",
    rating: 4.5,
    price: "$19.99",
    hours: 10,
    category: "Web Dev",
    image: require("../../assets/courses/html-css.png"),
  },
  {
    id: "2",
    title: "JavaScript Basics",
    constructor: "Author 1",
    rating: 4.5,
    price: "$20.99",
    hours: 12,
    category: "Web Dev",
    image: require("../../assets/courses/js.jpg"),
  },
  {
    id: "3",
    title: "Bootstrap Essentials",
    constructor: "Author 1",
    rating: 4.5,
    price: "$19.99",
    hours: 8,
    category: "Web Dev",
    image: require("../../assets/courses/html-css.png"),
  },
  {
    id: "4",
    title: "Adobe Photoshop",
    constructor: "Author 2",
    rating: 4.0,
    price: "$29.99",
    hours: 15,
    category: "Graphic Design",
    image: require("../../assets/courses/photoshop.png"),
  },
  {
    id: "5",
    title: "Adobe Illustrator",
    constructor: "Author 2",
    rating: 4.0,
    price: "$29.99",
    hours: 15,
    category: "Graphic Design",
    image: require("../../assets/courses/illustrator.png"),
  },
  {
    id: "6",
    title: " UX Design & Interaction (The `How`)",
    constructor: "Author 3",
    rating: 3.5,
    price: "$19.99",
    hours: 8,
    category: "UX UI",
    image: require("../../assets/courses/html-css.png"),
  },
  {
    id: "7",
    title: "Mathematical & Statistical Foundations",
    constructor: "Author 4",
    rating: 5.0,
    price: "$49.99",
    hours: 20,
    category: "Data Science",
    image: require("../../assets/courses/mathematic.png"),
  },
];

export default function CourseList({ selectedCategory }) {
  const filteredCourses =
    selectedCategory === "All"
      ? Courses
      : Courses.filter((item) => item.category === selectedCategory);
  return (
    <View>
      <Text style={styles.textHeader}>Courses List</Text>
      {filteredCourses.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No courses found in this category.
        </Text>
        ): (
        filteredCourses.map((course) => (
        <TouchableOpacity style={styles.card} key={course.id}>
          <Image source={course.image} style={styles.cardImage} />
          <View style={styles.cardBody}>
            <Text style={styles.textTitle}>{course.title}</Text>
            <Text style={styles.textHours}>{course.hours} hours</Text>
            <View style={styles.row}>
              <Text style={styles.textPrice}>{course.price}</Text>
              <TouchableOpacity 
              style={styles.enrollButton}
              onPress={() => console.log(`Enrolled in ${course.title}`)}
              >
                <Text style={styles.textEnroll}>Enroll now</Text>
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
  enrollButton: {
    backgroundColor: "#3F51B5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  textEnroll: {
    color: "white",
    fontWeight: "500",
  },
});
