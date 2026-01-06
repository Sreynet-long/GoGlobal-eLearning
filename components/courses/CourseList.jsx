import { useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
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
import { IMAGE_BASE_URL } from "../../config/env";
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

const getCourseAction = (course) => {
  const progress = course.overall_completion_percentage ?? 0;

  if (course.has_course_completed || progress === 100) {
    return { label: "Completed", type: "completed" };
  }

  if (course.has_enrolled) {
    if (progress > 0) return { label: "Continue", type: "continue" };
    return { label: "Start course", type: "start" };
  }

  return { label: "View Detail", type: "view" };
};

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
    const action = getCourseAction(course);

    if (action.type === "view") {
      setSelectedCourse(course);
      setModalVisible(true);
      return;
    }
    router.push({
      pathname: `/course/${course._id}`,
      params: {
        courseId: course._id,
        resume: action.type === "continue",
      },
    });
  };

  const renderItem = useCallback(
    ({ item }) => {
      const hasDiscount = item.original_price > item.sell_price;
      const action = getCourseAction(item);

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
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${item.overall_completion_percentage}%` },
                        ]}
                      />
                      </View>
                        <Text style={styles.progressText}>
                          {item.overall_completion_percentage}%
                        </Text>
                      
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

      <CourseDetailModal
        visible={modalVisible}
        course={selectedCourse}
        onClose={() => setModalVisible(false)}
      />
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
});
