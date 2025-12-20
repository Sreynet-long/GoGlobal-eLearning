import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import { IMAGE_BASE_URL } from "../../config/env";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_WITH_PAGINATION } from "../../schema/course";
import CourseIncludes from "./CourseInclude";
import EnrolledButton from "./EnrolledButton";

export default function CourseList({ selectedCategoryId, searchText }) {
  const { language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { isAuth } = useAuth();

  const categoryId = selectedCategoryId === "All" ? "All" : selectedCategoryId;

  const { data, loading, error, networkStatus } = useQuery(
    GET_COURSE_WITH_PAGINATION,
    {
      variables: {
        page: 1,
        limit: 50,
        pagination: false,
        keyword: searchText?.trim() || "",
        categoryId,
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );

  const isInitialLoading = loading && !data;
  const isRefetching = networkStatus === 4;
  const courses = data?.getCourseWithPagination?.data ?? [];

  if (isInitialLoading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0404d8ff" />
      </View>
    );

  if (error)
    return (
      <View style={{alignItems: "center" , marginTop: 250}}>
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
      </View>
    );

  return (
    <View>
      <Text style={styles.textHeader}>{t("courses_list", language)}</Text>

      {isInitialLoading && (
        <ActivityIndicator size="small" style={{ marginVertical: 10 }} />
      )}

      {courses.length === 0 ? (
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
        courses.map((course) => (
          <TouchableOpacity
            style={styles.card}
            key={course._id}
            onPress={() => {
              setSelectedCourse(course);
              setModalVisible(true);
            }}
          >
            <Image
              source={{ uri: `${IMAGE_BASE_URL}/file/${course.thumbnail}` }}
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
                  onPress={() => {
                    setSelectedCourse(course);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.textEnroll}>{t("enroll", language)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
              <Divider />
              <ScrollView showsVerticalScrollIndicator={false}>
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
                    <Text style={{ marginHorizontal: 5, fontSize: 18, color: "#888" }}>|</Text>
                    <Text style={styles.sellPrice}>
                      ${selectedCourse.sell_price?.toFixed(2) ?? "0.00"}
                    </Text>
                  </View>
                  <EnrolledButton course={selectedCourse} onSuccess={() => setModalVisible(false)} />
                  <Divider style={{ marginVertical: 12 }} />
                  <Text style={styles.includesTitle}>
                    This Course includes:
                  </Text>
                  <CourseIncludes course={selectedCourse} />
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
  priceBox: { flexDirection: "column" },
  textPrice: {
    fontSize: 13,
    color: "#8a8888ff",
    textDecorationLine: "line-through",
  },
  textSellPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#25375aff",
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 195,
  },
  emptyImage: { marginTop: 100, width: 60, height: 60, alignSelf: "center" },
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
    height: "87%",
  },
  closeButton: { alignSelf: "flex-end", padding: 5, marginBottom: 5 },
  modalImage: { width: "100%", height: 180, borderRadius: 10, marginTop: 10 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginVertical: 10 },
  modalPriceRow: { flexDirection: "row", alignItems: "center" },
  sellPrice: { fontSize: 24, fontWeight: "700" },
  oldPrice: {
    marginLeft: 6,
    color: "#888",
    textDecorationLine: "line-through",
    fontSize: 20,
  },
  cartButton: {
    backgroundColor: "#6a2bd9",
    marginTop: 15,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cartText: { color: "#fff", fontWeight: "600" },
  includesTitle: { marginTop: 15, fontWeight: "700", fontSize: 16 },
});
