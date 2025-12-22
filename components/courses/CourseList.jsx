import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import {
  FlatList,
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
import EmptyCourse from "./EmptyCourse.jsx";

/* ---------------- Skeleton ---------------- */
const CourseSkeleton = () => (
  <View style={styles.contentContainerStyle}>
    <View style={[styles.card, { opacity: 0.5 }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.cardBody}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: "50%" }]} />
      </View>
    </View>
  </View>
);

export default function CourseList({ selectedCategoryId, searchText }) {
  const { language } = useLanguage();
  const { isAuth } = useAuth();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, loading, error , refetch} = useQuery(GET_COURSE_WITH_PAGINATION, {
    variables : {
      page: 1,
      limit: 50,
      pagination: false,
      keyword: searchText?.trim() || "",
      categoryId: selectedCategoryId && selectedCategoryId === "All" ? "All" : selectedCategoryId,
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    refetch();
  }, [searchText, selectedCategoryId]);

  const courses = data?.getCourseWithPagination?.data ?? [];
  const isInitialLoading = loading && !data;

  /* ---------------- Loading ---------------- */
  if (isInitialLoading) {
    return (
      <View>
        {[...Array(5)].map((_, i) => (
          <CourseSkeleton key={i} />
        ))}
      </View>
    );
  }

  /* ---------------- Error ---------------- */
  if (error) {
    return (
      <View style={{ alignItems: "center", marginTop: 200 }}>
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
      </View>
    );
  }

  /* ---------------- Render Item (courses) ---------------- */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedCourse(item);
        setModalVisible(true);
      }}
    >
      <Image
        source={{ uri: `${IMAGE_BASE_URL}/file/${item.thumbnail}` }}
        style={styles.cardImage}
      />

      <View style={styles.cardBody}>
        <Text style={styles.textTitle}>{item.title}</Text>

        <View style={styles.row}>
          <View style={styles.priceBox}>
            <Text style={styles.textPrice}>
              ${item.original_price?.toFixed(2) ?? "0.00"}
            </Text>
            <Text style={styles.textSellPrice}>
              ${item.sell_price?.toFixed(2) ?? "0.00"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.enrollButton}
            onPress={() => {
              setSelectedCourse(item);
              setModalVisible(true);
            }}
          >
            <Text style={styles.textEnroll}>{t("enroll", language)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contentContainerStyle}>
      <Text style={styles.textHeader}>{t("courses_list", language)}</Text>
      
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, flexGrow:1 }}
        ListEmptyComponent={<EmptyCourse/>}
      />

      {/* ---------------- Modal ---------------- */}
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
                    <Text style={{ marginHorizontal: 6 }}>|</Text>
                    <Text style={styles.sellPrice}>
                      ${selectedCourse.sell_price?.toFixed(2) ?? "0.00"}
                    </Text>
                  </View>

                  {isAuth && (
                    <EnrolledButton
                      course={selectedCourse}
                      onSuccess={() => setModalVisible(false)}
                    />
                  )}

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

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  textHeader: { fontSize: 18, fontWeight: "700", paddingBottom: 10 },

  card: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },

  cardImage: { width: "40%", height: 120 },
  cardBody: { flex: 1, padding: 10, justifyContent: "center" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },

  enrollButton: {
    backgroundColor: "#3F51B5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },

  textEnroll: { color: "#fff", fontWeight: "500" },
  textTitle: { fontSize: 16, fontWeight: "600" },

  priceBox: {},
  textPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  textSellPrice: { fontSize: 16, fontWeight: "700" },

  skeletonImage: {
    width: "40%",
    height: 120,
    backgroundColor: "#ddd",
  },
  skeletonLine: {
    height: 14,
    backgroundColor: "#ddd",
    marginBottom: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    height: "84%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
  },
  closeButton: { alignSelf: "flex-end", padding: 5 },
  modalImage: { width: "100%", height: 180, borderRadius: 10, marginTop: 10 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginVertical: 10 },
  modalPriceRow: { flexDirection: "row", alignItems: "center" },
  sellPrice: { fontSize: 24, fontWeight: "700" },
  oldPrice: {
    fontSize: 18,
    textDecorationLine: "line-through",
    color: "#888",
  },
  includesTitle: { marginTop: 15, fontWeight: "700", fontSize: 16 },
});
