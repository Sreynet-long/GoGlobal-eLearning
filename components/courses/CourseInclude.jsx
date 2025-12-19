import { StyleSheet, Text, View } from "react-native";

export default function CourseIncludes({ course }) {
  const includes = course?.course_includes;

  if (!includes) {
    return <Text style={styles.emptyText}>• No course details available</Text>;
  }

  return (
    <View>
      {includes.number_of_downloadable_resources !== null && (
        <Text style={styles.item}>
          • {includes.number_of_downloadable_resources} downloadable resources
        </Text>
      )}
      {includes.number_of_downloadable_resources !== null && (
        <Text style={styles.item}>
          • {includes.number_of_downloadable_resources} downloadable resources
        </Text>
      )}
      {includes.number_of_hours !== null && (
        <Text style={styles.item}>• {includes.number_of_hours} hours</Text>
      )}
      {includes.number_of_lessons !== null && (
        <Text style={styles.item}>• {includes.number_of_lessons} lessons</Text>
      )}
      {includes.number_of_projects_practices !== null && (
        <Text style={styles.item}>
          • {includes.number_of_projects_practices} projects & practices
        </Text>
      )}
      {includes.number_of_video !== null && (
        <Text style={styles.item}>• {includes.number_of_video} videos</Text>
      )}
      {includes.number_quizzes !== null && (
        <Text style={styles.item}>• {includes.number_quizzes} quizzes</Text>
      )}

      {includes.has_certificate_of_completion && (
        <Text style={styles.item}>• Certificate of completion</Text>
      )}

      {includes.is_full_lifetime_access && (
        <Text style={styles.item}>• Full lifetime access</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginTop: 5,
    fontSize: 14,
    color: "#3a3a3a",
  },
  emptyText: {
    marginTop: 5,
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
});
