import { useQuery } from "@apollo/client/react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GET_CONTENT_SECTION_WITH_PAGINATION , GET_VIDEO_CONTENT_WITH_PAGINATION} from "../../schema/course";
import { Divider } from "react-native-paper";
import VideoList from "./VideoList";
export default function CourseContent({ courseId }) {
  const [page, setPage] = useState(1);
  const [expandedSection, setExpandedSection] = useState(1);
  const [currentLessonId, setCurrentLessonId] = useState(3);
  const { data, loading } = useQuery(GET_CONTENT_SECTION_WITH_PAGINATION, {
    variables: {
      page: 1,
      limit: 29,
      pagination: false,
      keyword: "",
      courseId,
    },
  });

  if (loading) {
    return <ActivityIndicator size="large" color="rgba(17, 34, 189, 1)" />;
  }

  const sections = data?.getContentSectionWithPagination?.data || [];
  const paginator = data?.getContentSectionWithPagination?.paginator;
  

  // --- 1. Fix ReferenceError by defining data properly ---
//   const courses = useMemo(
//     () => [
//       {
//         id: 1,
//         title: "Section 1: Course Agenda",
//         lessons: 3,
//         time: "10min",
//         items: [
//           {
//             id: 1,
//             title: "Welcome to the course",
//             duration: "02:30",
//             completed: true,
//           },
//           {
//             id: 2,
//             title: "How to get help",
//             duration: "05:00",
//             completed: true,
//           },
//           {
//             id: 3,
//             title: "Downloadable Resources",
//             duration: "03:00",
//             completed: false,
//             hasResources: true,
//           },
//         ],
//       },
//       {
//         id: 2,
//         title: "Section 2: Setup & Installation",
//         lessons: 2,
//         time: "45min",
//         items: [
//           {
//             id: 4,
//             title: "Installing Dependencies",
//             duration: "20:00",
//             completed: false,
//           },
//           {
//             id: 5,
//             title: "Environment Configuration",
//             duration: "25:00",
//             completed: false,
//           },
//         ],
//       },
//     ],
//     []
//   );

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Course Curriculum</Text>
      {sections.map((section) => (
        <View key={section._id} style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() =>
              setExpandedSection(
                expandedSection === section.id ? null : section._id
              )
            }
          >
            <View style={{ flex: 1 }}>
            <View style={styles.sectionTitleTextContainer}>
              <Text style={styles.sectionTitleText}>
                Section {section.section_order}:
              </Text>
              <Text style={styles.sectionTitleText}>
                {""}  {section.section_title}
              </Text>
              </View>
              {/* <Text style={styles.sectionSubText}>
                {section.lessons} lessons • {section.time}
              </Text> */}
            </View>
            <MaterialCommunityIcons
              name={
                expandedSection === section._id ? "chevron-up" : "chevron-down"
              }
              size={22}
              color="#3F51B5"
            />
          </TouchableOpacity>
            <Divider/>
          {expandedSection === section._id &&
          <VideoList sectionId={section._id}/>
            }
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  sectionTitleTextContainer:{ flex : 1, flexDirection:"row"},
  sectionTitleText: { fontSize: 15, fontWeight: "700", color: "#2D3436" },
  sectionSubText: { fontSize: 12, color: "#ADADAD", marginTop: 2 }, 
});
