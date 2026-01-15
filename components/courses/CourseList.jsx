import { useQuery } from "@apollo/client/react";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FILE_BASE_URL } from "../../config/env";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_WITH_PAGINATION } from "../../schema/course";
import CourseDetailModal from "./CourseDetailModal";
import EmptyCourse from "./EmptyCourse";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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

const getProgress = (course) => {
  const value = Number(course?.overall_completion_percentage);
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
};
const getCourseAction = (course, language) => {
  const progress = course.overall_completion_percentage ?? 0;

  if (course.has_course_completed || progress === 100) {
    return { label: t("completed", language), type: "completed" };
  }

  if (course.has_enrolled) {
    if (progress > 0)
      return { label: t("continue", language), type: "continue" };
    return { label: t("start_course", language), type: "start" };
  }

  return { label: t("View Detail", language), type: "view" };
};

export default function CourseList({ selectedCategoryId, searchText }) {
  const router = useRouter();
  const { isAuth } = useAuth();
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

  useFocusEffect(
    useCallback(() => {
      refetch({ fetchPolicy: "network-only" });
    }, [refetch])
  );

  useEffect(() => {
    if (isAuth !== undefined) {
      refetch();
    }
  }, [isAuth, searchText, selectedCategoryId]);

  const courses = data?.getCourseWithPagination?.data ?? [];

  const handleOpenDetails = useCallback(
    (course) => {
      const action = getCourseAction(course, language);

      if (action.type === "view") {
        setSelectedCourse(course);
        setModalVisible(true);
        return;
      }
      router.push({
        pathname: `/course/[courseId]`,
        params: {
          courseId: course._id,
          resume: action.type === "continue",
        },
      });
    },
    [router, language]
  );

  const renderItem = useCallback(
    ({ item }) => {
      const action = getCourseAction(item, language);
      const progress = getProgress(item);
      const sellPrice = Number(item.sell_price) || 0;
      const originalPrice = Number(item.original_price) || 0;

      const isFree = item.is_free_course === true || sellPrice === 0;

      const hasDiscount =
        !item.has_enrolled &&
        !isFree &&
        sellPrice > 0 &&
        originalPrice > sellPrice;
      const discountPercent =
        hasDiscount && originalPrice > 0
          ? Math.round(((originalPrice - sellPrice) / originalPrice) * 100)
          : 0;

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
          onPress={() => handleOpenDetails(item)}
        >
          <Image
            source={{ uri: `${FILE_BASE_URL}/file/${item.thumbnail}` }}
            style={styles.cardImage}
            resizeMode="cover"
          />

          {hasDiscount && (
            <View style={styles.discountPill}>
              <Text style={styles.discountPillText}>
                {discountPercent}% OFF
              </Text>
            </View>
          )}

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
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${progress}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{progress}%</Text>
                    </View>

                    <View style={styles.cardFooter}>
                      <View
                        style={[
                          styles.enrollBadge,
                          action.type === "completed" && styles.completedBadge,
                        ]}
                      >
                        <Text
                          style={[
                            action.type === "completed"
                              ? styles.completedText
                              : action.type === "continue"
                              ? styles.textContinue
                              : styles.textEnroll,
                          ]}
                        >
                          {action.label}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                <View style={styles.priceContainer}>
                  {isFree ? (
                    <Text style={styles.freeText}>FREE</Text>
                  ) : (
                    <View style={styles.priceRow}>
                      <Text style={styles.textSellPrice}>
                        ${Number(item.sell_price).toFixed(2)}
                      </Text>
                      {hasDiscount && (
                        <Text style={styles.textOldPrice}>
                          ${Number(item.original_price).toFixed(2)}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.enrollBadge}>
                    <Text style={styles.textEnroll}>
                      {t("view_detail", language)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [language, handleOpenDetails]
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
        extraData={courses}
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
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
      {selectedCourse && (
        <CourseDetailModal
          visible={modalVisible}
          course={selectedCourse}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },
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
    marginBottom: 14,
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
  discountPill: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomRightRadius: 15,
  },
  discountPillText: { color: "#fff", fontSize: 11, fontWeight: "900" },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  freeText: {
    alignSelf: "flex-start",
    marginTop: 10,
    fontSize: 15,
    fontWeight: "900",
    color: "#10b981",
    backgroundColor: "#10b98123",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 6,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  textEnroll: { color: "#3F51B5", fontWeight: "600", fontSize: 12 },
  textContinue: { color: "#8d8513ff", fontWeight: "600", fontSize: 12 },

  sectionBox: { marginTop: 5, padding: 15, borderRadius: 12 },
  sectionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    fontWeight: "500",
    flex: 1,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 8,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },

  progressText: {
    fontSize: 14,
    color: "#22c55e",
    fontWeight: "700",
    minWidth: 40,
    textAlign: "right",
  },
  completedBadge: {
    backgroundColor: "#E6F7E6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  completedText: { color: "#2E7D32", fontWeight: "600", fontSize: 12 },

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
});
