import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Divider } from "react-native-paper";
import { IMAGE_BASE_URL } from "../../config/env.js";
import { GET_COURSE_WITH_PAGINATION } from "../../schema/course";

export default function CourseList({ selectedCategoryId, searchText }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, loading, error } = useQuery(GET_COURSE_WITH_PAGINATION, {
    variables: {
      page: 1,
      limit: 50,
      pagination: false,
      keyword: searchText || "",
      categoryId: selectedCategoryId === "All" ? "All" : selectedCategoryId,
    },
  });
  console.log("data", data?.getCourseWithPagination?.data);
  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#58589bff"
          alignItems="center"
          marginTop={20}
        />
      </View>
    );
  if (error)
    return <Text style={styles.textHeader}>Error: {error.message}</Text>;
  const Courses = data?.getCourseWithPagination?.data || [];

  const filteredCourses =
    selectedCategoryId === "All"
      ? Courses
      : Courses.filter((item) => item.category_id?._id === selectedCategoryId);

  console.log("IMAGE_BASE_URL", IMAGE_BASE_URL);
  return (
    <View>
      <Text style={styles.textHeader}>Courses List</Text>
      {filteredCourses.length === 0 ? (
        <View>
          <Image
            source={require("../../assets/images/find-course.png")}
            style={styles.emptyImage}
          />
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No courses found in this category.
          </Text>
        </View>
      ) : (
        filteredCourses.map((course) => (
          <TouchableOpacity style={styles.card} key={course._id}>
            <Image
              source={{
                uri: `${IMAGE_BASE_URL}/file/${course.thumbnail}`,
              }}
              style={styles.cardImage}
            />
            <View style={styles.cardBody}>
              <Text style={styles.textTitle}>{course.title}</Text>
              {/* <Text style={styles.textHours}>{course.hours} hours</Text> */}
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
                  onPress={() => {
                    setSelectedCourse(course);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.textEnroll}>Enroll</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
            <Divider />
            {selectedCourse && (
              <>
                <Image
                  source={{
                    uri: `${IMAGE_BASE_URL}/file/${selectedCourse.thumbnail}`,
                  }}
                  style={styles.modalImage}
                />
                <Divider style={{ marginVertical: 12 }} />
                <Text style={styles.modalTitle}>{selectedCourse.title}</Text>

                <View style={styles.modalPriceRow}>
                  <Text style={styles.oldPrice}>
                    ${selectedCourse.original_price?.toFixed(2) ?? "0.00"}
                  </Text>
                  <Text style={styles.sellPrice}>
                    ${selectedCourse.sell_price?.toFixed(2) ?? "0.00"}
                  </Text>
                </View>
                <TouchableOpacity style={styles.cartButton}>
                  <Text style={styles.cartText}>Confirm Enroll</Text>
                </TouchableOpacity>
                <Divider style={{ marginVertical: 12 }} />
                <Text style={styles.includesTitle}>This Course includes:</Text>
                {() => {
                  const includes = selectedCourse?.course_includes?.[0];
                  if (!includes) return null;
                  return (
                    <>
                      <Text style={styles.includeItem}>
                        • {includes.number_of_downloadable_resources} downloadable
                        resources
                      </Text>
                      <Text style={styles.includeItem}>
                        • {includes.number_of_hours} hours
                      </Text>
                      <Text style={styles.includeItem}>
                        • {includes.number_of_lessons} lessons
                      </Text>
                      <Text style={styles.includeItem}>
                        • {includes.number_of_projects_practices} projects & practices
                      </Text>
                      <Text style={styles.includeItem}>
                        • {includes.number_of_video} videos
                      </Text>
                      <Text style={styles.includeItem}>
                        • {includes.number_quizzes} quizzes
                      </Text>
                      {includes.has_certificate_of_completion && (
                        <Text style={styles.includeItem}>
                          • Certificate of completion
                        </Text>
                      )}
                      {includes.is_full_lifetime_access && (
                        <Text style={styles.includeItem}>
                          • Full lifetime access
                        </Text>
                      )}
                    </>
                  );
                }}
              </>
            )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    fontSize: 13,
    color: "#8a8888ff",
    textDecorationLine: "line-through",
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
  emptyImage: {
    marginTop: 100,
    width: 60,
    height: 60,
    alignSelf: "center",
  },
  textSellPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#25375aff",
    marginTop: 2,
  },
  priceBox: {
    flexDirection: "column",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 140,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
    padding: 16,
    height: "95%",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
    marginBottom: 5,
  },
  modalImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellPrice: {
    fontSize: 24,
    fontWeight: "700",
  },
  oldPrice: {
    marginLeft: 6,
    color: "#888",
    textDecorationLine: "line-through",
    fontSize: 20,
  },
  timeText: {
    color: "red",
    marginTop: 5,
  },
  cartButton: {
    backgroundColor: "#6a2bd9",
    marginTop: 15,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cartText: {
    color: "#fff",
    fontWeight: "600",
  },
  buyButton: {
    borderWidth: 1,
    borderColor: "#6a2bd9",
    marginTop: 10,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  includesTitle: {
    marginTop: 15,
    fontWeight: "700",
    fontSize: 16,
  },
  includeItem: {
    marginTop: 5,
    color: "#3a3a3aff",
    fontSize: 14,
  },
});
