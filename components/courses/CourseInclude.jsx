import { StyleSheet, Text, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Row component
function Row({ icon, children }) {
  return (
    <View style={styles.row}>
      {icon}
      <Text style={styles.item}>{children}</Text>
    </View>
  );
}

// Main component
export default function CourseIncludes({ course }) {
  const includes = course?.course_includes;

  if (!includes) {
    return <Text style={styles.emptyText}>• No course details available</Text>;
  }

  const rows = [
    includes.number_of_downloadable_resources != null && (
      <Row
        key="download"
        icon={<Entypo name="download" size={15} color="#000" />}
      >
      <Text> {`${includes.number_of_downloadable_resources} downloadable resources`}</Text> 
      </Row>
    ),
    includes.number_of_hours != null && (
      <Row key="hours" icon={<Entypo name="hour-glass" size={15} color="#000" />}>
        <Text>{`${includes.number_of_hours} hours`}</Text>
      </Row>
    ),
    includes.number_of_lessons != null && (
      <Row key="lessons" icon={<Entypo name="folder" size={15} color="#000" />}>
        <Text>{`${includes.number_of_lessons} lessons`}</Text>
      </Row>
    ),
    includes.number_of_projects_practices != null && (
      <Row
        key="projects"
        icon={
          <MaterialCommunityIcons
            name="application-brackets-outline"
            size={15}
            color="#000"
          />
        }
      >
        <Text>{`${includes.number_of_projects_practices} projects & practices`}</Text>
      </Row>
    ),
    includes.number_of_video != null && (
      <Row key="videos" icon={<Entypo name="folder-video" size={15} color="#000" />}>
        {`${includes.number_of_video} videos`}
      </Row>
    ),
    includes.number_quizzes != null && (
      <Row
        key="quizzes"
        icon={
          <MaterialCommunityIcons
            name="file-question-outline"
            size={17}
            color="#000"
          />
        }
      >
        <Text>{`${includes.number_quizzes} quizzes`}</Text>
      </Row>
    ),
    includes.has_certificate_of_completion && (
      <Row
        key="certificate"
        icon={<MaterialCommunityIcons name="certificate-outline" size={17} color="#000" />}
      >
        <Text>Certificate of completion</Text>
      </Row>
    ),
    includes.is_full_lifetime_access && (
      <Row
        key="lifetime"
        icon={<MaterialCommunityIcons name="timer-sand-full" size={17} color="#000" />}
      >
        <Text>Full lifetime access</Text>
      </Row>
    ),
  ];

  // Filter out null/false rows
  return <View>{rows.filter(Boolean)}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 5,
  },
  item: {
    fontSize: 15,
    color: "#3a3a3a",
  },
  emptyText: {
    marginTop: 5,
    fontSize: 15,
    color: "#999",
    fontStyle: "italic",
  },
});
