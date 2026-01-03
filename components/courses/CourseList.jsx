import { useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import { IMAGE_BASE_URL } from "../../config/env";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_WITH_PAGINATION } from "../../schema/course";
import CourseIncludes from "./CourseInclude";
import EmptyCourse from "./EmptyCourse";
import EnrolledButton from "./EnrolledButton";
import { useAuth } from "../../context/AuthContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Helper to safely render text strings
const renderText = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) return "• " + value.join("\n• ");
  if (typeof value === "object") return "";
  return String(value);
};

// Skeleton placeholder component
const CourseSkeleton = () => (
  <View style={styles.cardSkeleton}>
    <View style={styles.skeletonImage} />
    <View style={styles.cardBody}>
      <View style={[styles.skeletonLine, { width: "80%" }]} />
      <View style={[styles.skeletonLine, { width: "40%" }]} />
      <View style={styles.skeletonButton} />
    </View>
  </View>
);

export default function CourseList({ selectedCategoryId, searchText }) {
  const router = useRouter();
  const isAuth = useAuth();
  const { language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { data, loading, refetch } = useQuery(GET_COURSE_WITH_PAGINATION, {
    variables: {
      page: 1,
      limit: 50,
      pagination: false,
      keyword: searchText?.trim() || "",
      categoryId: selectedCategoryId === "All" ? "All" : selectedCategoryId,
    },
    fetchPolicy: "cache-and-network",
   
  });

  useEffect(() => {
    refetch();
  }, [searchText, selectedCategoryId, isAuth]);

  const courses = data?.getCourseWithPagination?.data ?? [];

  const handleOpenDetails = (course) => {
    console.log("select course:", course);
    if (course.has_enrolled) {
      router.push(`/course/${course._id}`);
    } else {
      setSelectedCourse(course);
      setModalVisible(true);
    }
  };

  const renderItem = useCallback(
    ({ item }) => {
      const hasDiscount = item.original_price > item.sell_price;

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
          onPress={() => handleOpenDetails(item)}
        >
          <Image
            source={{ uri: `${IMAGE_BASE_URL}/file/${item.thumbnail}` }}
            style={styles.cardImage}
            resizeMode="cover"
          />

          <View style={styles.cardBody}>
            <Text style={styles.textTitle} numberOfLines={2}>
              {renderText(item.title)}
            </Text>
            {item.has_enrolled ? (
              <>
                {item.has_course_completed ? (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.progressText}>
                     {item.overall_completion_percentage}% Completed
                    </Text>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${item.overall_completion_percentage}%` },
                        ]}
                      />
                    </View>
                    <View style={styles.cardFooter}>
                      <View style={styles.enrollBadge}>
                        <Text style={styles.textContinue}>Continue</Text>
                      </View>
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                <View style={styles.priceContainer}>
                  <Text style={styles.textSellPrice}>
                    ${Number(item.sell_price)?.toFixed(2)}
                  </Text>
                  {hasDiscount && (
                    <Text style={styles.textOldPrice}>
                      ${Number(item.original_price)?.toFixed(2)}
                    </Text>
                  )}
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.enrollBadge}>
                    <Text style={styles.textEnroll}>View Detail</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [language]
  );

  if (loading && !data) {
    return (
      <View style={styles.contentContainerStyle}>
        {[1, 2, 3, 4].map((i) => (
          <CourseSkeleton key={i} />
        ))}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        removeClippedSubviews
        initialNumToRender={6}
        windowSize={10}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={50}
        ListHeaderComponent={
          <Text style={styles.textHeader}>{t("courses_list", language)}</Text>
        }
        contentContainerStyle={[
          styles.contentContainerStyle,
          courses.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={<EmptyCourse />}
      />

      {/* Modal for unenrolled courses */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              keyboardShouldPersistTaps= "handled"
              // bounces={false}
            >
              {selectedCourse ? (
                <>
                  <Image
                    source={{
                      uri: `${IMAGE_BASE_URL}/file/${selectedCourse.thumbnail}`,
                    }}
                    style={styles.modalImage}
                  />
                  <Text style={styles.modalTitle}>
                    {renderText(selectedCourse.title)}
                  </Text>

                  {selectedCourse.has_enrolled ? (
                    <>
                      {selectedCourse.has_course_completed ? (
                        <View style={styles.completedBadge}>
                          <Text style={styles.completedText}>Completed</Text>
                        </View>
                      ) : (
                        <>
                          <Text style={styles.progressText}>
                            Progress:{" "}
                            {selectedCourse.overall_completion_percentage}%
                          </Text>
                          <View style={styles.progressBarContainer}>
                            <View
                              style={[
                                styles.progressBar,
                                {
                                  width: `${selectedCourse.overall_completion_percentage}%`,
                                },
                              ]}
                            />
                          </View>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {selectedCourse.sell_price != null && (
                        <View style={styles.modalPriceRow}>
                          <Text style={styles.modalSellPrice}>
                            ${Number(selectedCourse.sell_price).toFixed(2)}
                          </Text>
                          {selectedCourse.original_price >
                            selectedCourse.sell_price && (
                            <Text style={styles.modalOldPrice}>
                              ${Number(selectedCourse.original_price).toFixed(2)}
                            </Text>
                          )}
                        </View>
                      )}
                      <EnrolledButton
                        course={selectedCourse}
                        onSuccess={() => setModalVisible(false)}
                      />
                    </>
                  )}

                  <View style={styles.sectionDivider}>
                    <Text style={styles.includesTitle}>Course Includes:</Text>
                    <Divider style={{ marginVertical: 10 }} />
                    <CourseIncludes course={selectedCourse} />
                  </View>

                  <View style={styles.sectionWhatULearn}>
                    <Text style={styles.title}>What you'll learn:</Text>
                    {selectedCourse?.what_you_learn?.trim() ? (
                      <>
                        {selectedCourse?.what_you_learn
                          ?.split("\n")
                          .map((line, index) => (
                            <Text key={index} style={styles.paragraph}>
                              • {line}
                            </Text>
                          ))}
                      </>
                    ) : (
                      <Text style={styles.emptyText}>No content here.</Text>
                    )}

                    <Text style={styles.title}>Who this course is for:</Text>
                    {selectedCourse?.who_this_course_is_for?.trim() ? (
                      <>
                        {selectedCourse?.who_this_course_is_for
                          ?.split("\n")
                          .map((line, index) => (
                            <Text key={index} style={styles.paragraph}>
                              • {line}
                            </Text>
                          ))}
                      </>
                    ) : (
                      <Text style={styles.emptyText}>No content here.</Text>
                    )}

                    <Text style={styles.title}>Requirements:</Text>
                    {selectedCourse?.requirements?.trim() ? (
                      <>
                        {selectedCourse?.requirements
                          ?.split("\n")
                          .map((line, index) => (
                            <Text key={index} style={styles.paragraph}>
                              • {line}
                            </Text>
                          ))}
                      </>
                    ) : (
                      <Text style={styles.emptyText}>No content here.</Text>
                    )}

                    <Text style={styles.title}>Description:</Text>
                    {selectedCourse?.description?.trim() ? (
                      <>
                        {selectedCourse?.description
                          ?.split("\n")
                          .map((line, index) => (
                            <Text key={index} style={styles.paragraph}>
                              • {line}
                            </Text>
                          ))}
                      </>
                    ) : (
                      <Text style={styles.emptyText}>No content here.</Text>
                    )}
                  </View>

                  <View style={{ height: 30 }} />
                </>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: { padding: 16 },
  textHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardImage: { width: "35%", height: 110 },
  cardBody: { flex: 1, padding: 12, justifyContent: "space-between" },
  textTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D2D2D",
    lineHeight: 20,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  
  textSellPrice: { fontSize: 17, fontWeight: "800", color: "#3F51B5" },
  textOldPrice: {
    fontSize: 12,
    color: "#e61111ff",
    textDecorationLine: "line-through",
    marginLeft: 6,
    fontWeight: "700",
  },

  cardFooter: { alignItems: "flex-end" },
  enrollBadge: {
    backgroundColor: "#F0F2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  textEnroll: { color: "#3F51B5", fontWeight: "600", fontSize: 12 },
  textContinue: { color: "#8d8513ff", fontWeight: "600", fontSize: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT * 0.86,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 10,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  modalImage: { width: "100%", height: 200, borderRadius: 15 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    marginTop: 15,
  },
  modalPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  modalSellPrice: { fontSize: 28, fontWeight: "800", color: "#3F51B5" },
  modalOldPrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 10,
  },

  sectionDivider: {
    marginTop: 20,
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
  },
  includesTitle: { fontWeight: "700", fontSize: 16, color: "#444" },
  sectionBox: { marginTop: 5, padding: 15, borderRadius: 12 },
  sectionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    fontWeight: "500",
    flex: 1,
  },

  progressText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    color: "#3F51B5",
    marginLeft: 100
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginVertical: 8,
  },
  progressBar: { height: 10, backgroundColor: "#3F51B5", borderRadius: 5 },
  completedBadge: {
    backgroundColor: "#E6F7E6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  completedText: { color: "#2E7D32", fontWeight: "700", fontSize: 14 },

  cardSkeleton: {
    flexDirection: "row",
    height: 110,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 16,
  },
  skeletonImage: { width: "35%", backgroundColor: "#E0E0E0" },
  skeletonLine: {
    height: 15,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginTop: 12,
    marginLeft: 10,
  },
  skeletonButton: {
    width: 60,
    height: 20,
    backgroundColor: "#E0E0E0",
    alignSelf: "flex-end",
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  sectionBox: {
    marginTop: 5,
    padding: 15,
    borderRadius: 12,
  },

  sectionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    fontWeight: "500",
    flex: 1,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  bullet: {
    marginRight: 8,
    fontSize: 16,
    lineHeight: 20,
    color: "#3F51B5",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 13,
    marginBottom: 10,
    color: "rgba(0, 0, 0, 1)",
    fontStyle: "italic",
  },
  paragraph: { fontSize: 16, lineHeight: 24, marginBottom: 6, color: "#333" },
});
